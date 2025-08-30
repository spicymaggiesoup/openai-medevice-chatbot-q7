import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE ?? "http://13.125.229.157/";

export async function GET() {
  const r = await fetch(`${API_BASE}/api/auth/login/`, { cache: "no-store" });
  const j = await r.json();
  return NextResponse.json(j);  // => { ok: true }
}