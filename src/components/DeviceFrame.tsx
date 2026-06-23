"use client";

import { TypeGlowProvider, useTypeGlow } from "./TypeGlow";

interface DeviceFrameProps {
  children: React.ReactNode;
}

function DeviceFrameInner({ children }: DeviceFrameProps) {
  const { color } = useTypeGlow();

  return (
    <div className="flex h-dvh w-full items-center justify-center p-0 md:p-4">
      <div
        className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-none border-0 border-red-900/60 bg-[var(--color-chrome)] transition-all duration-700 md:rounded-2xl md:border"
        style={{
          boxShadow: `0 0 30px ${color}20, 0 0 60px ${color}10, inset 0 0 20px ${color}08`,
          animation: "flicker 4s ease-in-out infinite",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-red-900/30 px-3 py-1.5 md:px-4 md:py-2">
          <span className="font-mono text-xs font-bold tracking-widest text-red-500">
            DEX.AI
          </span>
          <span className="font-mono text-[10px] text-gray-600">v0.1.0</span>
        </div>

        {/* Scan sweep line */}
        <div className="scan-sweep-line" />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <TypeGlowProvider>
      <DeviceFrameInner>{children}</DeviceFrameInner>
    </TypeGlowProvider>
  );
}
