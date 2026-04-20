import { NextResponse } from "next/server";

const MEGAPAGOS_API = process.env.MEGAPAGOS_API!;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const origin = request.headers.get("host") || "localhost:3000";
    const protocol = origin.includes("localhost") ? "http" : "https";

    const authRes = await fetch(`${protocol}://${origin}/api/megapagos/auth`);
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

    const keyRes = await fetch(`${MEGAPAGOS_API}/key/public`, {
      cache: 'no-store',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!keyRes.ok) {
      const errorData = await keyRes.json().catch(() => null);
      console.error("Error al obtener la llave pública:", errorData);
      return NextResponse.json(
        { status: 400, message: "Error al obtener la llave pública." },
        { status: 400 }
      );
    }

    const data = await keyRes.json();

    return NextResponse.json({
      status: 200,
      message: "Successful in get the data",
      public_key: data.data?.public_key ?? data.public_key ?? '',
    });
  } catch (error) {
    console.error("Error al obtener la llave pública:", error);
    return NextResponse.json(
      { status: 500, message: "Error al obtener la llave pública." },
      { status: 500 }
    );
  }
}
