import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content wrapper — flex-1 to fill remaining space */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <main className="flex-1 overflow-y-auto w-full p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
