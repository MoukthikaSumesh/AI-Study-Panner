import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_SESSIONS, type Session, type SessionStatus } from "./planner-data";

type Store = {
  sessions: Session[];
  setStatus: (id: string, status: SessionStatus) => void;
  regenerate: () => void;
  planLabel: string;
  setPlanLabel: (label: string) => void;
};

const PlannerContext = createContext<Store | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() =>
    INITIAL_SESSIONS.map((s) => ({ ...s })),
  );
  const [planLabel, setPlanLabel] = useState("Term plan · week of 14 Oct");

  const value = useMemo<Store>(
    () => ({
      sessions,
      planLabel,
      setPlanLabel,
      setStatus: (id, status) =>
        setSessions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: s.status === status ? "planned" : status } : s,
          ),
        ),
      regenerate: () =>
        setSessions(
          INITIAL_SESSIONS.map((s, i) => ({
            ...s,
            status: i < 2 ? "completed" : "planned",
          })),
        ),
    }),
    [sessions, planLabel],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider");
  return ctx;
}
