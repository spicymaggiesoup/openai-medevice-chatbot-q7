import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE ?? "http://15.165.110.223/";

export async function GET() {
  const r = await fetch(`${API_BASE}/api/health/`, { cache: "no-store" });
  const j = await r.json();
  return NextResponse.json(j);  // => { ok: true }
}

export async function POST(req: Request) {
  const body = await req.json();
  const r = await fetch(`${API_BASE}/echo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  return NextResponse.json(j);
}
