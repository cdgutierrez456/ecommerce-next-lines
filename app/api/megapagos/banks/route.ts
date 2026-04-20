import { NextResponse } from "next/server";

const MEGAPAGOS_API = process.env.MEGAPAGOS_API!;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
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

    const banksRes = await fetch(`${MEGAPAGOS_API}/transaction/get-banks`, {
      cache: 'no-store',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('bank', banksRes);

    if (!banksRes.ok) {
      const errorData = await banksRes.json().catch(() => null);
      console.error("Error al obtener los bancos de PSE:", errorData);
      return NextResponse.json(
        { status: 400, message: "Error al obtener los bancos de PSE." },
        { status: 400 }
      );
    }

    const data = await banksRes.json();
    const banks = (data.data || []).map((bank: any) => ({
      bankCode: bank.financialInstitutionCode,
      bankName: bank.financialInstitutionName,
    }));

    return NextResponse.json({
      status: 200,
      message: "Successful in get the data",
      data: banks,
      comercio: tokenInfo.comercio || null,
    });
  } catch (error) {
    console.error("Error al obtener los bancos de PSE:", error);
    return NextResponse.json(
      { status: 500, message: "Error al obtener los bancos de PSE." },
      { status: 500 }
    );
  }
}
