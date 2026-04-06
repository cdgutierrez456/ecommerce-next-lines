import { NextResponse } from "next/server";

const MEGAPAGOS_API = process.env.MEGAPAGOS_API!;

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const respons = await fetch(`${MEGAPAGOS_API}/transaction/create`)
}