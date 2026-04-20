import { NextResponse } from "next/server";

const MEGAPAGOS_API = process.env.MEGAPAGOS_API!;

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("host") || "localhost:3000";
    const protocol = origin.includes("localhost") ? "http" : "https";

    const authRes = await fetch(`${protocol}://${origin}/api/megapagos/auth`, { cache: 'no-store' });
    if (!authRes.ok) {
      return NextResponse.json(
        { status: 400, message: "Error al autenticar con Megapagos" },
        { status: 400 }
      );
    }

    const tokenInfo = await authRes.json();
    const accessToken = tokenInfo.token?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { status: 401, message: "No se obtuvo token de autenticación" },
        { status: 401 }
      );
    }

    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { status: 400, message: "El campo transactionId es requerido" },
        { status: 400 }
      );
    }

    const res = await fetch(`${MEGAPAGOS_API}/transaction/get-info`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ transactionId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { status: res.status, message: data?.message || 'Error al consultar el estado de la transacción' },
        { status: res.status }
      );
    }

    return NextResponse.json({ status: 200, message: 'Información de transacción obtenida', data });
  } catch (error) {
    console.error('Error al consultar estado de transacción:', error);
    return NextResponse.json(
      { status: 500, message: 'Error interno al consultar el estado de la transacción' },
      { status: 500 }
    );
  }
}
