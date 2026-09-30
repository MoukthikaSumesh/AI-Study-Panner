import { Link } from "@tanstack/react-router";
import { SUBJECTS } from "@/lib/planner-data";
import { usePlanner } from "@/lib/planner-store";
import { overallStats } from "@/lib/planner-data";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/setup", label: "Study plan setup" },
  { to: "/plan", label: "Weekly plan" },
  { to: "/progress", label: "Progress" },
] as const;

export function AppSidebar() {
  const { sessions } = usePlanner();
  const stats = overallStats(sessions);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-card/60 p-5 lg:flex">
      <div className="flex items-center gap-2.5 px-1">
        <div className="grid size-9 place-items-center rounded-xl bg-accent font-bold text-accent-foreground">
          S
        </div>
        <div className="leading-tight">
          <div className="font-semibold tracking-tight">Study Planner</div>
          <div className="label-mono">AI schedules</div>
        </div>
      </div>

      <div className="label-mono mt-7 mb-2 px-3">Navigate</div>
      <nav className="space-y-1 text-sm">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-ink/5"
            activeProps={{ className: "bg-accent/10 text-accent font-medium" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="label-mono mt-6 mb-2 px-3">Subjects</div>
      <div className="space-y-2 px-3 text-sm">
        {Object.entries(SUBJECTS).map(([key, s]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${s.dot}`} />
            {s.name}
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-xl border border-line p-3">
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span>Weekly focus</span>
          <span className="font-mono text-muted-foreground">{stats.percent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
          <div className="fillbar h-full rounded-full bg-accent" style={{ width: `${stats.percent}%` }} />
        </div>
        <div className="mt-2 font-mono text-[10px] text-muted-foreground">
          {stats.completed} of {stats.total} blocks done
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="flex gap-1.5 overflow-x-auto border-b border-line bg-card/60 px-4 py-2.5 text-sm lg:hidden">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.to === "/" }}
          className="shrink-0 rounded-lg px-3 py-1.5 text-muted-foreground"
          activeProps={{ className: "bg-accent/10 text-accent font-medium" }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
