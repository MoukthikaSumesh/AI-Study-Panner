import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Bar, Card } from "@/components/ui-bits";
import { DAYS, EXAMS, SUBJECTS, overallStats, subjectStats } from "@/lib/planner-data";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — AI Study Planner" },
      {
        name: "description",
        content:
          "Weekly completion, total study hours, completed sessions and subject-wise progress.",
      },
      { property: "og:title", content: "Progress — AI Study Planner" },
      {
        property: "og:description",
        content: "Track weekly completion, study hours and subject-wise progress.",
      },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { sessions } = usePlanner();
  const stats = overallStats(sessions);
  const bySubject = subjectStats(sessions);

  const dayMinutes = DAYS.map((d) => ({
    day: d,
    done: sessions
      .filter((s) => s.day === d && s.status === "completed")
      .reduce((a, s) => a + s.minutes, 0),
    total: sessions.filter((s) => s.day === d).reduce((a, s) => a + s.minutes, 0),
  }));
  const peak = Math.max(...dayMinutes.map((d) => d.total), 1);

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Week of 14 Oct" title="Progress" />

      <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card className="p-4">
          <div className="label-mono">Weekly completion</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            {stats.percent}
            <span className="text-lg text-muted-foreground">%</span>
          </div>
          <div className="mt-3">
            <Bar percent={stats.percent} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="label-mono">Study hours logged</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            {stats.hoursDone}
            <span className="text-lg text-muted-foreground">h</span>
          </div>
          <div className="mt-3 font-mono text-[11px] text-muted-foreground">
            of {stats.hoursPlanned}h planned
          </div>
        </Card>
        <Card className="p-4">
          <div className="label-mono">Completed sessions</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{stats.completed}</div>
          <div className="mt-3 font-mono text-[11px] text-muted-foreground">
            of {stats.total} blocks
          </div>
        </Card>
        <Card className="p-4">
          <div className="label-mono">Skipped</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{stats.skipped}</div>
          <div className="mt-3">
            <Bar
              percent={stats.total ? (stats.skipped / stats.total) * 100 : 0}
              color="bg-rose"
            />
          </div>
        </Card>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold tracking-tight">Daily study minutes</h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {dayMinutes.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end rounded-lg bg-ink/5">
                  <div
                    className="flex w-full items-end rounded-lg bg-accent/25"
                    style={{ height: `${(d.total / peak) * 100}%` }}
                  >
                    <div
                      className="w-full rounded-lg bg-accent"
                      style={{ height: d.total ? `${(d.done / d.total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
                <span className="label-mono">{d.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] text-muted-foreground">
            Solid = completed · light = planned
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold tracking-tight">Subject-wise progress</h2>
          <div className="mt-4 space-y-4">
            {bySubject.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium">{s.name}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {s.done}/{s.total} · {s.hours}h
                  </span>
                </div>
                <div className="mt-2">
                  <Bar percent={s.percent} color={SUBJECTS[s.key].bar} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold tracking-tight">Upcoming exams</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {EXAMS.map((e) => (
            <div key={e.title} className="rounded-xl border border-line bg-paper/50 p-3">
              <div className="flex items-center gap-2">
                <span className={`size-2.5 shrink-0 rounded-full ${SUBJECTS[e.subject].dot}`} />
                <span className="min-w-0 truncate text-sm font-medium">{e.title}</span>
              </div>
              <div className="mt-2 font-mono text-[10px] text-muted-foreground">
                in {e.days} days · {e.readiness}% ready
              </div>
              <div className="mt-2">
                <Bar percent={e.readiness} color={SUBJECTS[e.subject].bar} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
