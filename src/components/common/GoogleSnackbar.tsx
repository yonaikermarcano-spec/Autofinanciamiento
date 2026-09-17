"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  id?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (options: ToastOptions | string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Helper para disparar Toasts desde cualquier parte del código
export const toast = {
  show: (options: ToastOptions | string, type: ToastType = "info") => {
    if (typeof window !== "undefined") {
      const detail = typeof options === "string" ? { message: options, type } : options;
      window.dispatchEvent(new CustomEvent("google_snackbar_trigger", { detail }));
    }
  },
  success: (message: string) => toast.show(message, "success"),
  error: (message: string) => toast.show(message, "error"),
  warning: (message: string) => toast.show(message, "warning"),
  info: (message: string) => toast.show(message, "info"),
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<ToastOptions>;
      if (customEvent.detail) {
        addToast(customEvent.detail);
      }
    };
    window.addEventListener("google_snackbar_trigger", handleTrigger);
    return () => window.removeEventListener("google_snackbar_trigger", handleTrigger);
  }, []);

  const addToast = (options: ToastOptions) => {
    const id = options.id || `${Date.now()}-${Math.random()}`;
    const newToast: ToastOptions = {
      id,
      type: options.type || "info",
      duration: options.duration || 4500,
      ...options,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const contextValue: ToastContextType = {
    showToast: (options, type = "info") => {
      const opts = typeof options === "string" ? { message: options, type } : options;
      addToast(opts);
    },
    success: (msg) => addToast({ message: msg, type: "success" }),
    error: (msg) => addToast({ message: msg, type: "error" }),
    warning: (msg) => addToast({ message: msg, type: "warning" }),
    info: (msg) => addToast({ message: msg, type: "info" }),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Contenedor de Snackbars Flotantes estilo Google */}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 left-5 z-[9999] flex flex-col gap-2 max-w-md w-[calc(100vw-2.5rem)] pointer-events-none"
      >
        {toasts.map((t) => {
          const type = t.type || "info";
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />}
                {type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 flex-shrink-0" />}
                {type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 dark:text-amber-600 flex-shrink-0" />}
                {type === "info" && <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 flex-shrink-0" />}
                <span className="truncate leading-relaxed">{t.message}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {t.action && (
                  <button
                    onClick={() => {
                      t.action?.onClick();
                      if (t.id) removeToast(t.id);
                    }}
                    className="font-bold text-google-blue-400 dark:text-google-blue-600 hover:underline uppercase text-[11px] tracking-wider px-1 cursor-pointer"
                  >
                    {t.action.label}
                  </button>
                )}
                <button
                  onClick={() => t.id && removeToast(t.id)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white dark:hover:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition cursor-pointer"
                  aria-label="Cerrar notificación"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return toast;
  }
  return context;
}
