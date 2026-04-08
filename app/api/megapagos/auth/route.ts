import { NextResponse } from "next/server";

const MEGAPAGOS_API = process.env.MEGAPAGOS_API!;
const MEGAPAGOS_USER = process.env.MEGAPAGOS_USER!;
const MEGAPAGOS_PASS = process.env.MEGAPAGOS_PASS!;

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${MEGAPAGOS_API}/user/login-comercio`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: MEGAPAGOS_USER,
        pass: MEGAPAGOS_PASS,
        tokens: null,
        loginDirecto: true,
        client: "api",
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error al autenticar con Megapagos" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const tokenInfo = data?.data || {};
    if (tokenInfo.error) return NextResponse.json(
      { error: "Error al autenticar con Megapagos" },
      { status: res.status }
    );

    return NextResponse.json(tokenInfo);
  } catch (error) {
    console.error("Error al autenticar con Megapagos:", error);
    return NextResponse.json(
      { error: "Error al autenticar con Megapagos" },
      { status: 500 }
    );
  }
}
