"use client"

import type React from "react"
import type { MouseEvent } from "react"
import { useState, useEffect, useRef, useCallback } from "react"

import { redirect, useRouter } from "next/navigation";

// import Hanspell  from "hanspell";

import { useChatToken, useUserInfo, useMedicalDepartments, useChatRoom } from "@/lib/store";
import { API_BASE, WS_BASE } from "@/lib/proxy";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MediBot } from "@/components/img/medi-bot"
import { MediLogo } from "@/components/img/medi-logo"
import { ProfileForm } from "@/components/profile-form"

import { IconMenu } from "@/components/icon/icon-menu"
import { IconSettings } from "@/components/icon/icon-settings"
import { MapLayout } from "@/components/map-layout"
import { chatInterfaceTemplate } from "@/lib/template"
import { Send, LogOut, Home, Activity, Clock, Plus, Navigation, Phone } from "lucide-react"

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type WsMsg =
| { v: 1; id: string; method: Method; route: string; headers?: any; query?: any; body?: any; data?: any; event?: any };

//url 
//const url = WS_BASE;

/**
 * React 훅 형태의 WebSocket RPC 클라이언트
 */
export function HomeInterface2() {
  const wsRef = useRef<WebSocket | null | undefined>(null);
  const pendingRef = useRef<
    Map<string, { resolve: (v: any) => void; reject: (e: any) => void; t: number }>
  >(new Map());
  const queueRef = useRef<WsMsg[]>([]);
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const reconnectDelayRef = useRef(1000);

  // 토큰
  const token = useChatToken((s) => s.chatToken);

  const url = new URL(`${WS_BASE}/api/chat/ws/146`);

  const connect = useCallback(() => {
    //if (token) { u.searchParams.set('token', token); }

    console.log("Websocket URL :: ", url);
    console.log("Websocket TOKEN :: ", token);

    //const ws = new WebSocket(`ws://medic.yoon.today/api/chat/ws/146?token=${token}`);
    //const ws = new WebSocket(url, [`Bearer ${token}`]);
    const ws = new WebSocket(`${url}?token=${token}`);
    //const ws = new WebSocket(`ws://medic.yoon.today/api/chat/rooms/146/messages?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("콘솔 socket opened!! token: ", token, ', url::: ', url);
      reconnectDelayRef.current = 1000;

      // 큐에 쌓인 메시지 flush
      queueRef.current.splice(0).forEach((msg) => ws.send(JSON.stringify(msg)));
    };

    ws.onmessage = (e) => {
      let data: WsMsg;
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }

      if ('id' in data && (data as any).status !== undefined) {
        const slot = pendingRef.current.get(data.id);
        if (slot) {
          pendingRef.current.delete(data.id);
          clearTimeout(slot.t);
          slot.resolve(data);
        }
      } else if ('event' in data) {
        const handlers = listenersRef.current.get(data.event);
        handlers?.forEach((h) => h(data.data));
      }
    };

    ws.onclose = () => {
      setTimeout(connect, reconnectDelayRef.current);
      reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 15000);
    };
  }, [url, token]);

  const call = useCallback(
    (
      method: Method,
      route: string,
      { headers, query, body, timeoutMs = 15000 }: any = {}
    ) => {
      const id = crypto.randomUUID();
      const msg: WsMsg = { v: 1, id, method, route, headers, query, body };

      return new Promise<{ ok: boolean; status: number; headers?: any; body?: any }>(
        (resolve, reject) => {
          const t = window.setTimeout(() => {
            pendingRef.current.delete(id);
            reject(new Error('ws-timeout'));
          }, timeoutMs);

          pendingRef.current.set(id, { resolve, reject, t });

          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
          } else {
            queueRef.current.push(msg);
          }
        }
      );
    },
    []
  );

  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(handler);
    return () => listenersRef.current.get(event)!.delete(handler);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      wsRef.current = undefined;
    };
  }, [connect]);

  return <></>;
  // return { call, on };
}