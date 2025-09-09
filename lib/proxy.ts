import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://15.165.110.223/";

export async function LOGIN(req: Request) {
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

    // 2) 필요한 헤더만 전달 (대부분 Authorization만)
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

    return res;

  } catch (err) {
    console.error("Proxy GET /api/chat/rooms error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

export async function ME(req: Request) {
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
  
      // 2) 필요한 헤더만 전달 (대부분 Authorization만)
      const auth = req.headers.get("authorization");
      const upstreamUrl = new URL("/api/auth/me", API_BASE).toString();
  
      const r = await fetch(upstreamUrl, {
        method: "GET",
        headers: auth ? { authorization: auth } : {},
        cache: "no-store", // 개발 중 캐시 끔
      });
  
      // 3) 응답 그대로 패스스루
      const body = await r.text();
      const res = new NextResponse(body, {
        status: r.status,
        headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
      });
      return res;
    } catch (err) {
      console.error("Proxy GET /api/auth/me error:", err);
      return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
    }
}

export async function LOCATION(req: Request) {
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

    // 2) 필요한 헤더만 전달 (대부분 Authorization만)
    const body = await req.json();
    const r = await fetch(`${API_BASE}/api/users/location`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const j = await r.json();
    const res = NextResponse.json(j, { status: r.status });

    return res;

  } catch (err) {
    console.error("Proxy GET /api/users/location error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

export async function CHAT_GET(req: Request) {
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

    // 2) 필요한 헤더만 전달 (대부분 Authorization만)
    const auth = req.headers.get("authorization");
    const upstreamUrl = new URL("/api/chat/rooms", API_BASE).toString();

    const r = await fetch(upstreamUrl, {
      method: "GET",
      headers: auth ? { authorization: auth } : {},
      cache: "no-store", // 개발 중 캐시 끔
    });

    // 3) 응답 그대로 패스스루
    const body = await r.text();
    const res = new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
    return res;
  } catch (err) {
    console.error("Proxy GET /api/chat/rooms error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

export async function CHAT_POST(req: Request) {
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

    // 2) 필요한 헤더만 전달 (대부분 Authorization만)
    const auth = req.headers.get("authorization");
    const upstreamUrl = new URL("/api/chat/rooms", API_BASE).toString();

    const r = await fetch(upstreamUrl, {
      method: "POST",
      headers: auth ? { authorization: auth } : {},
      cache: "no-store", // 개발 중 캐시 끔
    });

    // 3) 응답 그대로 패스스루
    const body = await r.text();
    const res = new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
    return res;
  } catch (err) {
    console.error("Proxy POST /api/chat/rooms error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}


export async function MESSAGE_GET(req: Request) {
  try {
    const room_id = req.headers.get("roomid");

    // 1) 루프 방지: 잘못된 설정이면 바로 차단
    const origin = req.headers.get("origin") || "";
    if (!API_BASE) {
      return NextResponse.json({ ok: false, error: "API_BASE not set" }, { status: 500 });
    }

    if (origin && API_BASE.startsWith(origin)) {
      // 같은 오리진을 찍고 있으면 자기 자신 호출 루프 가능성 ↑
      return NextResponse.json({ ok: false, error: "API_BASE misconfigured (points to this app)" }, { status: 500 });
    }

    // 2) 필요한 헤더만 전달 (대부분 Authorization만)
    const auth = req.headers.get("authorization");
    const upstreamUrl = new URL(`/api/chat/rooms/${room_id}/`, API_BASE).toString();

    const r = await fetch(upstreamUrl, {
      method: "GET",
      headers: auth ? { authorization: auth } : {},
      cache: "no-store", // 개발 중 캐시 끔
    });

    // 3) 응답 그대로 패스스루
    const body = await r.text();
    const res = new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
    return res;
  } catch (err) {
    console.error("Proxy GET /api/chat/rooms/{room_id}/messages error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

export async function MESSAGE_POST(req: Request) {

}
