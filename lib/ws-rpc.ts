'use client';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type WsMsg =
  | { v: 1; id: string; method: Method; route: string; headers?: any; query?: any; body?: any }
  | { id: string; ok: boolean; status: number; headers?: any; body?: any }
  | { event: string; data: any };

export class WsRpc {
  private ws?: WebSocket;
  private url: string;
  private token?: string;
  private pending = new Map<string, { resolve: (v: any) => void; reject: (e: any) => void; t: number }>();
  private queue: WsMsg[] = [];
  private reconnectDelay = 1000;
  private listeners = new Map<string, Set<(data: any) => void>>();

  constructor(url: string, token?: string) {
    this.url = url;
    this.token = token;
  }

  connect() {
    const u = new URL(this.url);
    if (this.token) u.searchParams.set('token', this.token);
    this.ws = new WebSocket(u.toString());
    this.ws.onopen = () => {
      this.reconnectDelay = 1000;
      // flush queue
      this.queue.splice(0).forEach(msg => this.ws!.send(JSON.stringify(msg)));
    };
    this.ws.onmessage = (e) => {
      let data: WsMsg;
      try { data = JSON.parse(e.data); } catch { return; }
      if ('id' in data && (data as any).status !== undefined) {
        const slot = this.pending.get(data.id);
        if (slot) {
          this.pending.delete(data.id);
          slot.resolve(data);
        }
      } else if ('event' in data) {
        const handlers = this.listeners.get(data.event);
        handlers?.forEach(h => h(data.data));
      }
    };
    this.ws.onclose = () => {
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 15000);
    };
  }

  on(event: string, handler: (data: any) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.listeners.get(event)!.delete(handler);
  }

  call(method: Method, route: string, { headers, query, body, timeoutMs = 15000 }: any = {}) {
    const id = crypto.randomUUID();
    const msg: WsMsg = { v: 1, id, method, route, headers, query, body };
    return new Promise<{ ok: boolean; status: number; headers?: any; body?: any }>((resolve, reject) => {
      const entry = { resolve, reject, t: window.setTimeout(() => {
        this.pending.delete(id); reject(new Error('ws-timeout'));
      }, timeoutMs) };
      this.pending.set(id, entry);
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      } else {
        this.queue.push(msg);
      }
    });
  }
}
