// components/ui/toast.tsx
"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";

type ToastVariant = "default" | "success" | "warning" | "destructive" | "info";

export type ToastOptions = {
  id?: string | number;
  title: string;
  description?: string;
  duration?: number; // ms
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick?: () => void;
  };
};

type ToastItem = ToastOptions & { id: string; open: boolean };

type ToastContextValue = {
  toast: (opts: ToastOptions) => string; // returns id
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider />");
  }
  return ctx;
}

const variantClasses: Record<ToastVariant, string> = {
  default:
    "border-gray-200 bg-white text-gray-900",
  info:
    "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900",
  destructive:
    "border-red-200 bg-red-100 text-red-900",
  success:
    "border-blue-200 bg-blue-50 text-blue-900",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((opts: ToastOptions) => {
    const id = String(opts.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    const item: ToastItem = {
      id,
      open: true,
      title: opts.title,
      description: opts.description,
      duration: opts.duration ?? 4000,
      variant: opts.variant ?? "default",
      action: opts.action,
    };
    setToasts((prev) => [...prev, item]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: false } : t))
    );
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        {/* Toasts */}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            open={t.open}
            onOpenChange={(open) => {
              if (!open) {
                // 닫히는 애니메이션 끝난 뒤 제거
                setTimeout(() => remove(t.id), 150);
              }
            }}
            duration={t.duration}
            className={[
              "group pointer-events-auto relative w-[320px] rounded-lg border p-4 shadow-lg",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:slide-out-to-right-2 data-[state=open]:slide-in-from-right-2",
              "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
              "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
              variantClasses[t.variant ?? "default"],
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <ToastPrimitive.Title className="text-sm font-semibold">
                  {t.title}
                </ToastPrimitive.Title>
                {t.description ? (
                  <ToastPrimitive.Description className="mt-1 text-sm opacity-80">
                    {t.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                {t.action ? (
                  <ToastPrimitive.Action asChild altText={t.action.label}>
                    <button
                      onClick={t.action.onClick}
                      className="cursor-pointer rounded-md border px-2 py-1 text-xs hover:bg-black/5"
                    >
                      {t.action.label}
                    </button>
                  </ToastPrimitive.Action>
                ) : null}
                <ToastPrimitive.Close asChild>
                  <button
                    className="rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
                    aria-label="닫기"
                    onClick={() => dismiss(t.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </ToastPrimitive.Close>
              </div>
            </div>
          </ToastPrimitive.Root>
        ))}

        {/* 뷰포트 */}
        <ToastPrimitive.Viewport
          className={[
            "fixed bottom-4 right-4 z-[9999] flex max-h-screen w-[320px] flex-col gap-2 outline-none",
            "sm:right-6 sm:bottom-6",
          ].join(" ")}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
