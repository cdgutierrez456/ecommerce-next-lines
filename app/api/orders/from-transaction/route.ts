import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Megapagos status → OrderStatus
const STATUS_MAP: Record<string, OrderStatus> = {
  '1':   OrderStatus.PROCESSING, // Aprobado
  '11':  OrderStatus.PENDING,    // Pendiente
  '9':   OrderStatus.CANCELLED,  // Rechazado
  '17':  OrderStatus.CANCELLED,  // Anulado
  '999': OrderStatus.CANCELLED,  // Fallido
  '109': OrderStatus.CANCELLED,  // PSE Fallido
};

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const body = await request.json();
    const {
      transactionId,
      transactionStatus,
      shippingName,
      shippingEmail,
      shippingAddress,
      items,
      total,
    }: {
      transactionId: string;
      transactionStatus: string;
      shippingName: string;
      shippingEmail: string;
      shippingAddress: string;
      items: OrderItemInput[];
      total: number;
    } = body;

    if (!transactionId || !shippingName || !shippingEmail || !shippingAddress || !items?.length || total == null) {
      return NextResponse.json({ error: 'Datos incompletos para registrar la orden' }, { status: 400 });
    }

    // Idempotencia: si ya existe una orden con este transactionId, la devuelve
    const existing = await prisma.order.findUnique({
      where: { stripePaymentId: transactionId },
    });
    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const orderStatus = STATUS_MAP[transactionStatus] ?? OrderStatus.PENDING;

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        shippingName,
        shippingEmail,
        shippingAddress,
        status: orderStatus,
        stripePaymentId: transactionId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error al registrar orden desde transacción:', error);
    return NextResponse.json({ error: 'Error al registrar la orden' }, { status: 500 });
  }
}
