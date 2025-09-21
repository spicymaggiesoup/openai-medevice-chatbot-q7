import { NextResponse } from "next/server";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://medic.yoon.today";
export const WS_BASE = process.env.NEXT_PUBLIC_WS_URL;

// 회원가입
export async function REGISTER_MEMVER(req: Request) {
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
    const r = await fetch(`${API_BASE}/api/auth/register`, {
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
    console.error("Proxy GET /api/auth/register error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 로그인, token 얻음
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
    console.error("Proxy GET /api/auth/login error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 로그아웃
export async function LOGOUT(req: Request) {
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
    const r = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const j = await r.json();
    const res = NextResponse.json(j, { status: r.status });

    return res;

  } catch (err) {
    console.error("Proxy GET /api/auth/logout error:", err);
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

// 챗룸 목록 조회
export async function CHATROOM_LIST(req: Request) {
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

// 챗룸 생성
export async function CHATROOM_NEW(req: Request) {
  try {
    // 1) 안전장치
    const origin = req.headers.get("origin") || "";
    if (!API_BASE) {
      return NextResponse.json({ ok: false, error: "API_BASE not set" }, { status: 500 });
    }
    if (origin && API_BASE.startsWith(origin)) {
      return NextResponse.json({ ok: false, error: "API_BASE misconfigured (points to this app)" }, { status: 500 });
    }

    // 2) 헤더/바디 추출
    const auth = req.headers.get("authorization") || "";
    const contentType = req.headers.get("content-type") || "application/json";
    const body = await req.text(); // ← 반드시 원본 바디를 읽어서 전달

    // 3) 업스트림 호출
    const upstreamUrl = new URL("/api/chat/rooms", API_BASE).toString();
    const r = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        ...(auth ? { authorization: auth } : {}),
        "content-type": contentType,
        "accept": "application/json",
      },
      body,                 // ← 누락됐던 부분
      cache: "no-store",
    });

    // 4) 응답 패스스루
    const res = new NextResponse(r.body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
    return res;
  } catch (err) {
    console.error("Proxy POST /api/chat/rooms error:", err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 챗룸Id로 메시지 조회
export async function MESSAGES(req: Request, roomId: number) {
  if (!roomId) {
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
    const upstreamUrl = new URL(`/api/chat/rooms/${roomId}/messages`, API_BASE).toString();

    const r = await fetch(upstreamUrl, {
      method: "GET",
      headers: auth ? { authorization: auth } : {},
      cache: "no-store",
    });

    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error(`Proxy GET /api/chat/rooms/${roomId}/messages error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

// 메시지 전달
export async function SEND_MESSAGE(req: Request, roomId: number) {
  if (!roomId) {
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
    const contentType = req.headers.get("content-type") || "application/json";
    const body = await req.text();

    const upstreamUrl = new URL(`/api/chat/rooms/${roomId}/messages`, API_BASE).toString();

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
    console.error(`Proxy POST /api/chat/rooms/${roomId}/messages error:`, err);
    return NextResponse.json({ ok: false, error: "proxy-error" }, { status: 500 });
  }
}

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

    console.log('search::: ', search);

    if (!search || !departmentId || !diseaseId) {
      return NextResponse.json({ ok: false, error: "Query string not set" }, { status: 500 }); 
    }

    const r = await fetch(
      `${API_BASE}/api/medical/hospitals?search=${search}`,
      // `${API_BASE}/api/medical/hospitals${
      //   disease_id ? `?disease_id=${disease_id}` : ''
      // }
      // ${
      //   department_id ? `&department_id=${department_id}` : ''
      // }${
      //   disease_id ? `&disease_id=${disease_id}` : ''
      // }`,
      {
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
