// app/chat/page.tsx (또는 클라 컴포넌트)
"use client";
import { useState } from "react";

export function EchoTest() {
  const [msg, setMsg] = useState("ready");
  const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://15.165.110.223/";

  async function testHealth() {
    const r = await fetch(`${base}/api/health/`);
    const j = await r.json();
    setMsg(JSON.stringify(j));
  }

  async function testEcho() {
    const r = await fetch(`${base}/echo`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ hello: "world" }),
    });
    const j = await r.json();
    setMsg(JSON.stringify(j));
  }

  return (
    <div className="p-4 space-y-2">
      <button onClick={testHealth} className="border px-3 py-1">Health</button>
      <button onClick={testEcho} className="border px-3 py-1">Echo</button>
      <pre>{msg}</pre>
    </div>
  );
}
