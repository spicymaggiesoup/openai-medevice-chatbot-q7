///보관용
/*
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type WSContextType = {
  ws: WebSocket | null;
  connected: boolean;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => boolean;
  sendJson: (obj: any) => boolean;
};

const WSContext = createContext<WSContextType>({
  ws: null,
  connected: false,
  send: () => false,
  sendJson: () => false,
});

type Props = {
  children: React.ReactNode;
  userId: number | string;
  token?: string; // JWT 등
};

function buildUrl(base: string, userId: string | number, token?: string) {
  const trimmed = base.replace(/\/+$/, "");
  const u = `${trimmed}/${encodeURIComponent(String(userId))}`;
  return token ? `${u}?token=${encodeURIComponent(token)}` : u;
}

export function WSProvider({ children, userId, token }: Props) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
//   const hbTimer = useRef<NodeJS.Timer | null>(null);     // heartbeat
//   const rcTimer = useRef<NodeJS.Timeout | null>(null);    // reconnect
  const hbTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const rcTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attempts = useRef(0);

  const base = process.env.NEXT_PUBLIC_WS_BASE || "http://15.165.110.223/api/chat/rooms";

  const cleanup = useCallback(() => {
    if (hbTimer.current) { clearInterval(hbTimer.current); hbTimer.current = null; }
    if (wsRef.current) { wsRef.current.onopen = null; wsRef.current.onclose = null; wsRef.current.onmessage = null; wsRef.current.onerror = null; }
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      try { wsRef.current.close(); } catch {}
    }
    wsRef.current = null;
  }, []);

  const connect = useCallback(() => {
    const url = buildUrl(base, userId, token);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      attempts.current = 0;
      // 하트비트(서버가 무시해도 됨)
      if (hbTimer.current) clearInterval(hbTimer.current);
      hbTimer.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          try { wsRef.current.send(JSON.stringify({ type: "ping", ts: Date.now() })); } catch {}
        }
      }, 25_000);
      // 첫 연결시 방 입장 같은 초기 메시지가 필요하면 여기서 보내세요.
      // ws.send(JSON.stringify({ type: "join", room: "lobby" }));
    };

    ws.onclose = () => {
      setConnected(false);
      if (hbTimer.current) { clearInterval(hbTimer.current); hbTimer.current = null; }
      // 지수 백오프로 재연결
      const delay = Math.min(20000, 1000 * Math.pow(2, attempts.current++)); // 1s, 2s, 4s ... 최대 20s
      if (rcTimer.current) clearTimeout(rcTimer.current);
      rcTimer.current = setTimeout(connect, delay);
    };

    ws.onerror = (ev) => {
      // 콘솔 정도만
      // console.error("[WS] error", ev);
    };

    ws.onmessage = (ev) => {
      // 필요 시 전역 이벤트 버스/상태관리로 분배
      // console.log("[WS] message:", ev.data);
    };
  }, [base, token, userId]);

  useEffect(() => {
    if (!base) { console.error("WS base URL missing"); return; }
    connect();
    return () => {
      if (rcTimer.current) clearTimeout(rcTimer.current);
      cleanup();
    };
  }, [base, token, connect]);
  //}, [connect, cleanup]);

  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    const w = wsRef.current;
    if (!w || w.readyState !== WebSocket.OPEN) return false;
    try { w.send(data); return true; } catch { return false; }
  }, []);

  const sendJson = useCallback((obj: any) => send(JSON.stringify(obj)), [send]);

  const value = useMemo(() => ({ ws: wsRef.current, connected, send, sendJson }), [connected, send, sendJson]);

  return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
}

export function useWS() {
  return useContext(WSContext);
}
*/