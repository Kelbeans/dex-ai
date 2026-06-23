"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { TYPE_COLORS } from "./cards/TypeBadge";

interface TypeGlowContextValue {
  color: string;
  setActiveType: (type: string) => void;
}

const TypeGlowContext = createContext<TypeGlowContextValue>({
  color: "#dc2626",
  setActiveType: () => {},
});

export function TypeGlowProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState("#dc2626");

  const setActiveType = useCallback((type: string) => {
    const resolved = TYPE_COLORS[type.toLowerCase()] ?? "#dc2626";
    setColor(resolved);
  }, []);

  return (
    <TypeGlowContext.Provider value={{ color, setActiveType }}>
      {children}
    </TypeGlowContext.Provider>
  );
}

export function useTypeGlow() {
  return useContext(TypeGlowContext);
}
