import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Btn, Card } from "@/components/ui-bits";
import { DAYS, SUBJECTS, TODAY, overallStats } from "@/lib/planner-data";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Weekly Plan — AI Study Planner" },
      {
        name: "description",
        content:
          "A Monday to Sunday AI-generated study schedule with topics, durations and completion status.",
      },
      { property: "og:title", content: "Weekly Plan — AI Study Planner" },
      {
        property: "og:description",
        content: "Monday to Sunday study schedule you can mark complete, skip or adjust.",
      },
    ],
  }),
  component: WeeklyPlan,
});

function WeeklyPlan() {
  const { sessions, setStatus, regenerate } = usePlanner();
  const navigate = useNavigate();
  const stats = overallStats(sessions);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Oct 14 – 20"
        title="AI-generated weekly plan"
        actions={
          <>
            <Btn onClick={regenerate}>Adjust plan</Btn>
            <Btn tone="solid" onClick={() => navigate({ to: "/setup" })}>
              Edit inputs
            </Btn>
          </>
        }
      />

      <Card className="mt-6 border-accent/30 bg-accent/5">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent font-mono text-[11px] text-accent-foreground">
            AI
          </span>
          <div>
            <div className="label-mono">Recommendation</div>
            <p className="mt-1 text-sm">
              Your Physics exam is approaching in 4 days. Consider allocating more study time to
              Physics this week — two of your Physics blocks are still unstarted.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {DAYS.map((day) => {
          const daySessions = sessions.filter((s) => s.day === day);
          return (
            <Card key={day} className="p-4">
              <div className="flex items-center justify-between">
                <h2 className={`font-semibold tracking-tight ${day === TODAY ? "text-accent" : ""}`}>
                  {day}
                </h2>
                <span className="label-mono">{daySessions.length} blocks</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {daySessions.length === 0 ? (
                  <p className="font-mono text-[11px] text-muted-foreground">Rest day</p>
                ) : (
                  daySessions.map((s) => (
                    <div
                      key={s.id}
                      className={`rounded-xl border-l-4 bg-paper/60 p-3 ${SUBJECTS[s.subject].edge} ${
                        s.status === "skipped" ? "opacity-55" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{s.time}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {s.minutes}m
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm font-medium ${
                          s.status === "completed" ? "line-through decoration-muted-foreground" : ""
                        }`}
                      >
                        {SUBJECTS[s.subject].name}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.topic}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          onClick={() => setStatus(s.id, "completed")}
                          className={`rounded-lg px-2 py-1 font-mono text-[10px] uppercase transition ${
                            s.status === "completed"
                              ? "bg-teal/20 text-teal"
                              : "bg-ink/5 text-muted-foreground hover:bg-ink/10"
                          }`}
                        >
                          {s.status === "completed" ? "done" : "complete"}
                        </button>
                        <button
                          onClick={() => setStatus(s.id, "skipped")}
                          className={`rounded-lg px-2 py-1 font-mono text-[10px] uppercase transition ${
                            s.status === "skipped"
                              ? "bg-rose/20 text-rose"
                              : "bg-ink/5 text-muted-foreground hover:bg-ink/10"
                          }`}
                        >
                          skip
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        {stats.completed} completed · {stats.remaining} remaining · {stats.skipped} skipped
      </p>
    </div>
  );
}
