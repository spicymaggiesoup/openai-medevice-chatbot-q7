import { NextResponse } from "next/server";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
export const WS_BASE = process.env.NEXT_PUBLIC_WS_URL;

// 증상검색
export async function ANALYZE_SYMPTOM(req: Request) {
  try {
    const origin = req.headers.get("origin") || "";
    if (!API_BASE) {
      return NextResponse.json({ ok: false, error: "API_BASE not set" }, { status: 500 });
    }
    if (origin && API_BASE.startsWith(origin)) {
      return NextResponse.json(
        { ok: false, error: "API_BASE misconfigured (points to this app)" },
        { status: 500 }
      );
    }

    const auth = req.headers.get("authorization");
    const contentType = req.headers.get("content-type") || "application/json";
    const body = await req.text();

    const upstreamUrl = new URL(`/api/ml/analyze-symptom`, API_BASE).toString();

    const r = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        ...(auth ? { authorization: auth } : {}),
        "content-type": contentType,
        accept: "application/json",
      },
      body,
      cache: "no-store",
    });

    return new NextResponse(r.body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error(`Proxy POST /api/ml/analyze-symptom error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 증상+병원검색
export async function FULL_ANALYSIS(req: Request) {
  try {
    const origin = req.headers.get("origin") || "";
    if (!API_BASE) {
      return NextResponse.json({ ok: false, error: "API_BASE not set" }, { status: 500 });
    }
    if (origin && API_BASE.startsWith(origin)) {
      return NextResponse.json(
        { ok: false, error: "API_BASE misconfigured (points to this app)" },
        { status: 500 }
      );
    }

    const auth = req.headers.get("authorization");
    const contentType = req.headers.get("content-type") || "application/json";
    const body = await req.text();

    const upstreamUrl = new URL(`/api/ml/full-analysis`, API_BASE).toString();

    const r = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        ...(auth ? { authorization: auth } : {}),
        "content-type": contentType,
        "accept": "application/json",
      },
      body,
      cache: "no-store",
    });

    return new NextResponse(r.body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error(`Proxy POST /api/ml/full-analysis error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}
