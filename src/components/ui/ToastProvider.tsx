"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface Toast {
  id: string;
  title: string;
  type: "success" | "error";
}

interface ToastContextType {
  toast: (opts: { title: string; type: "success" | "error" }) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, type }: { title: string; type: "success" | "error" }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, title, type }]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              flex items-center gap-4 px-5 py-4 rounded-2xl
              backdrop-blur-xl border min-w-[320px] max-w-[420px]
              animate-fade-in shadow-2xl
              ${
                t.type === "success"
                  ? "bg-green-950/70 border-green-500/20"
                  : "bg-red-950/70 border-red-500/20"
              }
            `}
          >
            {/* Icon badge */}
            <div
              className={`
              flex items-center justify-center w-9 h-9 rounded-full shrink-0
              ${
                t.type === "success"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }
            `}
            >
              {t.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-white/90 flex-1">{t.title}</p>

            {/* Dismiss */}
            <button
              onClick={() => dismiss(t.id)}
              className="text-white/40 hover:text-white/70 transition-colors cursor-pointer shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
