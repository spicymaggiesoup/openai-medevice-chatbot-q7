import { NextResponse } from "next/server";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://medic.yoon.today";
export const WS_BASE = process.env.NEXT_PUBLIC_WS_URL;

// 진료과 ID, NAME
export async function DEPARTMENTS_BY_NAME(req: Request, departmentId?: number) {
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

    //const auth = req.headers.get("authorization");

    const r = await fetch(
      `${API_BASE}/api/medical/departments${departmentId ? `?serach=${departmentId}` : ''}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          //...(auth ? { authorization: auth } : {}),
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      }
    );

    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error(`Proxy GET /api/medical/departments error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 병원검색 - 이름
export async function SEARCH_HOSPITALS(req: Request) {
  try {
    // 1) 루프 방지: 잘못된 설정이면 바로 차단
    const origin = req.headers.get("origin") || "";
    if (!API_BASE) {
      return NextResponse.json({ ok: false, error: "API_BASE not set" }, { status: 500 });
    }

    if (origin && API_BASE.startsWith(origin)) {
      // 같은 오리진을 찍고 있으면 자기 자신 호출 루프 가능성 ↑
      return NextResponse.json({ ok: false, error: "API_BASE misconfigured (points to this app)" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const departmentId = searchParams.get("department_id");
    const diseaseId = searchParams.get("disease_id");

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (departmentId) params.set("department_id", departmentId);
    if (diseaseId) params.set("disease_id", diseaseId);

    const query = params.toString();
    const targetUrl = query
      ? `${API_BASE}/api/medical/hospitals?${query}`
      : `${API_BASE}/api/medical/hospitals`;

    const r = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const j = await r.json();
    const res = NextResponse.json(j, { status: r.status });

    return res;

  } catch (err) {
    console.error("Proxy GET /api/medical/hospitals search error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 병원위치 받기 - by id
export async function SEARCH_HOSPITAL_LOCATION(req: Request, hospitalId: number) {
if (!hospitalId) {
    return NextResponse.json({ ok: false, error: "roomId missing" }, { status: 400 });
  }

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

    const r = await fetch(
      `${API_BASE}/api/medical/hospitals/${hospitalId}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          ...(auth ? { authorization: auth } : {}),
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      }
    );

    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error(`Proxy GET /api/medical/hospitals/${hospitalId} error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 병원추천 질환ID
export async function RECOMMEND_HOSPITALS_BY_ID(req: Request) {
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

    const upstreamUrl = new URL(`/api/medical/recommend-hospitals`, API_BASE).toString();

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
    console.error(`Proxy POST /api/medical/recommend-hospitals error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 병원추천 질환명 + 사용자위치 기반
export async function RECOMMEND_HOSPITALS_BY_DISEASE(req: Request) {
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

    const upstreamUrl = new URL(`/api/medical/recommend-by-disease`, API_BASE).toString();

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
    console.error(`Proxy POST /api/medical/recommend-by-disease error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

