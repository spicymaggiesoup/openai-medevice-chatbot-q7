import { NextResponse } from "next/server";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
export const WS_BASE = process.env.NEXT_PUBLIC_WS_URL;

// 사용자위치 전달
export async function MODIFY_LOCATION(req: Request) {
    try {
      const origin = req.headers.get("origin") || "";
      if (!API_BASE) {
        return NextResponse.json({ ok: false, error: "API_BASE not set" }, { status: 500 });
      }
      if (origin && API_BASE.startsWith(origin)) {
        return NextResponse.json({ ok: false, error: "API_BASE misconfigured (points to this app)" }, { status: 500 });
      }
  
      const body = await req.json();
      const auth = req.headers.get("authorization") || "";
  
      const r = await fetch(`${API_BASE}/api/users/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { authorization: auth } : {}),
          "accept": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });
  
      return new NextResponse(await r.text(), {
        status: r.status,
        headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
      });
  
    } catch (err) {
      console.error("Proxy PUT /api/users/location error:", err);
      return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
    }
}
