import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Btn, Card } from "@/components/ui-bits";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Study Plan Setup — AI Study Planner" },
      {
        name: "description",
        content:
          "Add subjects, exam dates, topic difficulty and available hours, then generate a study plan.",
      },
      { property: "og:title", content: "Study Plan Setup — AI Study Planner" },
      {
        property: "og:description",
        content: "Set subjects, exam dates, difficulty and study hours to generate a plan.",
      },
    ],
  }),
  component: Setup,
});

type Row = {
  id: number;
  name: string;
  exam: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string;
};

const TIME_SLOTS = ["Early morning", "Morning", "Afternoon", "Evening", "Late night"];

const field =
  "w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Setup() {
  const navigate = useNavigate();
  const { regenerate } = usePlanner();
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: "Mathematics", exam: "2026-10-25", difficulty: "Medium", topics: "Integration, Series, Differential equations" },
    { id: 2, name: "Physics", exam: "2026-10-18", difficulty: "Hard", topics: "Rotational motion, Electric fields, Thermodynamics" },
    { id: 3, name: "Computer Science", exam: "2026-11-01", difficulty: "Medium", topics: "Graphs, Dynamic programming, SQL" },
    { id: 4, name: "English", exam: "2026-11-08", difficulty: "Easy", topics: "Essay structure, Comparative texts" },
  ]);
  const [hours, setHours] = useState(14);
  const [slots, setSlots] = useState<string[]>(["Morning", "Evening"]);

  const update = (id: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Step 1 of 2"
        title="Study plan setup"
        actions={<Btn onClick={() => navigate({ to: "/" })}>Back to dashboard</Btn>}
      />

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold tracking-tight">Subjects</h2>
          <Btn
            onClick={() =>
              setRows((prev) => [
                ...prev,
                { id: Date.now(), name: "", exam: "", difficulty: "Medium", topics: "" },
              ])
            }
          >
            Add subject
          </Btn>
        </div>

        <div className="mt-4 space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid gap-3 rounded-xl border border-line bg-paper/50 p-3 md:grid-cols-[1.2fr_1fr_0.8fr_1.6fr_auto]"
            >
              <label className="block">
                <span className="label-mono">Subject</span>
                <input
                  className={`${field} mt-1`}
                  value={r.name}
                  placeholder="e.g. Biology"
                  onChange={(e) => update(r.id, { name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label-mono">Exam date</span>
                <input
                  type="date"
                  className={`${field} mt-1`}
                  value={r.exam}
                  onChange={(e) => update(r.id, { exam: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label-mono">Difficulty</span>
                <select
                  className={`${field} mt-1`}
                  value={r.difficulty}
                  onChange={(e) => update(r.id, { difficulty: e.target.value as Row["difficulty"] })}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
              <label className="block">
                <span className="label-mono">Topics</span>
                <input
                  className={`${field} mt-1`}
                  value={r.topics}
                  placeholder="Comma separated"
                  onChange={(e) => update(r.id, { topics: e.target.value })}
                />
              </label>
              <div className="flex items-end">
                <Btn
                  tone="ghost"
                  onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                >
                  Remove
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold tracking-tight">Available study hours</h2>
          <p className="mt-1 text-sm text-muted-foreground">Total hours you can study each week.</p>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="range"
              min={4}
              max={40}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <span className="w-16 shrink-0 text-right font-mono text-sm">{hours}h</span>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold tracking-tight">Preferred study times</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => {
              const on = slots.includes(slot);
              return (
                <button
                  key={slot}
                  onClick={() =>
                    setSlots((prev) =>
                      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
                    )
                  }
                  className={`rounded-xl border px-3 py-1.5 text-sm transition ${
                    on
                      ? "border-accent/50 bg-accent/10 font-medium text-accent"
                      : "border-line bg-card text-muted-foreground hover:bg-ink/5"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-2">
        <Btn
          tone="solid"
          className="px-6 py-3 text-base"
          onClick={() => {
            regenerate();
            navigate({ to: "/plan" });
          }}
        >
          Generate Study Plan
        </Btn>
      </div>
    </div>
  );
}
