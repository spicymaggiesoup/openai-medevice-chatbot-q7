//연결테스트
const url = "BASE URL";
const rawToken = "ROW Token";

try {
    const r = await fetch(`${url}/api/chat/rooms/4/messages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rawToken}`, // 서버가 헤더로 인증 받는 구조
        },
        cache: 'no-store',
    });

    if (!r.ok) {
        console.log("❌ HTTP status:", r.status);
    } else {
        const data = await r.json();   // ✅ 여기서 await
        console.log("✅ Response JSON:", data);
    }
} catch(err) {
    console.error("⛔ Fetch error:", err);
}