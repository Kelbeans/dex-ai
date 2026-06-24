"use client";

import { TypeGlowProvider, useTypeGlow } from "./TypeGlow";

interface DeviceFrameProps {
  children: React.ReactNode;
}

function DeviceFrameInner({ children }: DeviceFrameProps) {
  const { color } = useTypeGlow();

  return (
    <div className="flex h-dvh w-full">
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--color-chrome)] transition-all duration-700"
        style={{
          boxShadow: `inset 0 0 30px ${color}08`,
          animation: "flicker 4s ease-in-out infinite",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-red-900/30 px-3 py-1.5 md:px-4 md:py-2">
          <span className="font-pokemon text-2xl tracking-wider text-red-500">
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
