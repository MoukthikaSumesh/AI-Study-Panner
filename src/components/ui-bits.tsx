import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Bar({ percent, color = "bg-accent" }: { percent: number; color?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
      <div className={`fillbar h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`animate-rise rounded-2xl border border-line bg-card p-5 ${className}`}>
      {children}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "solid" | "outline" | "ghost" };

export function Btn({ tone = "outline", className = "", ...props }: BtnProps) {
  const tones = {
    solid: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm font-semibold",
    outline: "border border-line bg-card hover:bg-ink/5 font-medium",
    ghost: "text-muted-foreground hover:bg-ink/5 font-medium",
  } as const;
  return (
    <button
      {...props}
      className={`rounded-xl px-3.5 py-2 text-sm transition hover:-translate-y-0.5 ${tones[tone]} ${className}`}
    />
  );
}
