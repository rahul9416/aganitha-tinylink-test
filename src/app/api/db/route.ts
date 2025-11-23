import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function GET() {
  const start = Date.now();
  try {
    const rows = await prisma.$queryRaw(Prisma.sql`SELECT 1 AS ok`);
    return NextResponse.json({ ok: true, rows, latencyMs: Date.now() - start });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}