"use client";

interface DeviceFrameProps {
  children: React.ReactNode;
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="flex h-dvh w-full items-center justify-center p-2 sm:p-4">
      <div
        className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-red-900/60 bg-[var(--color-chrome)]"
        style={{
          boxShadow:
            "0 0 30px rgba(220, 38, 38, 0.08), inset 0 0 20px rgba(220, 38, 38, 0.03)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-red-900/30 px-4 py-2">
          <span className="font-mono text-xs font-bold tracking-widest text-red-500">
            DEX.AI
          </span>
          <span className="font-mono text-[10px] text-gray-600">v0.1.0</span>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
