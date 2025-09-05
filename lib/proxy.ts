import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://15.165.110.223/";

export async function login(req: Request) {
  try {
    const body = await req.json();
    const r = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const j = await r.json();
    const res = NextResponse.json(j, { status: r.status });

    res.cookies.set("auth_token", j.auth_token, { httpOnly: true, secure: true, path: "/" });

    return res;
  } catch (err: any) {
    console.error("Proxy POST /api/auth/login error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}
