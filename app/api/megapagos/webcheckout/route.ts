import { NextResponse } from "next/server";

const MEGAPAGOS_API = process.env.MEGAPAGOS_API!;
const SHIPPING_COST = Number(process.env.SHIPPING_COST || '0');
const COMMERCE_NAME = process.env.COMMERCE_NAME || '';
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || '';
const BG_WEBCHECKOUT = process.env.BG_WEBCHECKOUT || '';
const TEXT_COLOR_WEBCHECKOUT = process.env.TEXT_COLOR_WEBCHECKOUT || '';

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

    const { value_to_pay } = await request.json();

    const body = {
      categoria: 'general',
      page_customization: {
        header: { color: BG_WEBCHECKOUT, text: TEXT_COLOR_WEBCHECKOUT },
        buttons: { color: BG_WEBCHECKOUT, text: TEXT_COLOR_WEBCHECKOUT },
      },
      value_to_pay: +value_to_pay + SHIPPING_COST,
      payment_method: [1, 2, 3],
      payment_concept: `Pago hecho a ${COMMERCE_NAME}`,
      redirect_url: NEXTAUTH_URL ? `${NEXTAUTH_URL}/checkout/status` : '',
      client: 'api',
    };
    console.log('Body', body);

    const res = await fetch(`${MEGAPAGOS_API}/webcheckout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { status: res.status, message: data?.message || 'Error al crear el webcheckout' },
        { status: res.status }
      );
    }

    return NextResponse.json({ status: 200, message: 'Webcheckout creado', data });
  } catch (error) {
    console.error('Error al crear webcheckout:', error);
    return NextResponse.json(
      { status: 500, message: 'Error interno al crear el webcheckout' },
      { status: 500 }
    );
  }
}
