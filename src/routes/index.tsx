import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Bar, Btn, Card } from "@/components/ui-bits";
import { DAYS, EXAMS, SUBJECTS, TODAY, overallStats } from "@/lib/planner-data";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Study Planner" },
      {
        name: "description",
        content:
          "Today's study sessions, upcoming exams and weekly progress in one student dashboard.",
      },
      { property: "og:title", content: "Dashboard — AI Study Planner" },
      {
        property: "og:description",
        content: "Today's sessions, upcoming exams and weekly study progress at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { sessions } = usePlanner();
  const navigate = useNavigate();
  const stats = overallStats(sessions);
  const today = sessions.filter((s) => s.day === TODAY);

  const statusLabel: Record<string, string> = {
    completed: "completed",
    skipped: "skipped",
    planned: "planned",
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Tue · 14 Oct"
        title="Good afternoon, Maya"
        actions={
          <>
            <Btn onClick={() => navigate({ to: "/plan" })}>Adjust My Plan</Btn>
            <Btn tone="solid" onClick={() => navigate({ to: "/setup" })}>
              Create Study Plan
            </Btn>
          </>
        }
      />

      <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card className="p-4">
          <div className="label-mono">Weekly progress</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            {stats.percent}
            <span className="text-lg text-muted-foreground">%</span>
          </div>
          <div className="mt-3">
            <Bar percent={stats.percent} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="label-mono">Completed sessions</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{stats.completed}</div>
          <div className="mt-3">
            <Bar percent={stats.percent} color="bg-teal" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="label-mono">Remaining tasks</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{stats.remaining}</div>
          <div className="mt-3 font-mono text-[11px] text-muted-foreground">
            {stats.skipped} skipped this week
          </div>
        </Card>
        <Card className="p-4">
          <div className="label-mono">Exams · 30 days</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{EXAMS.length}</div>
          <div className="mt-3 font-mono text-[11px] text-muted-foreground">
            next in {EXAMS[0]?.days ?? 0} days
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">Today's sessions</h2>
            <span className="label-mono">{today.length} blocks</span>
          </div>
          <div className="mt-4 space-y-3">
            {today.map((s) => (
              <div
                key={s.id}
                className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-l-4 bg-paper/60 py-2.5 pr-4 pl-3 sm:flex ${SUBJECTS[s.subject].edge}`}
              >
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                  {s.time}
                </span>
                <span className="min-w-0 truncate font-medium">
                  {SUBJECTS[s.subject].name} · {s.topic}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                  {s.minutes}m · {statusLabel[s.status]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold tracking-tight">Upcoming exams</h2>
          <div className="mt-4 space-y-3">
            {EXAMS.map((e) => (
              <div key={e.title}>
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium">{e.title}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    in {e.days} days
                  </span>
                </div>
                <div className="mt-2">
                  <Bar percent={e.readiness} color={SUBJECTS[e.subject].bar} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold tracking-tight">This week</h2>
          <span className="label-mono">Oct 14 – 20</span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2 text-center">
          {DAYS.map((d) => {
            const mins = sessions
              .filter((s) => s.day === d)
              .reduce((a, s) => a + s.minutes, 0);
            return (
              <div key={d}>
                <div className={`label-mono ${d === TODAY ? "text-accent" : ""}`}>
                  {d === TODAY ? "Today" : d}
                </div>
                <div className="mt-1 text-sm font-medium">{mins}m</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {DAYS.map((d) => {
            const count = sessions.filter((s) => s.day === d).length;
            return (
              <div
                key={d}
                className={`grid h-24 place-items-center rounded-lg ${
                  d === TODAY ? "bg-accent/30 ring-1 ring-accent/50" : "bg-accent/10"
                }`}
              >
                <span className="font-mono text-[10px] text-accent">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
