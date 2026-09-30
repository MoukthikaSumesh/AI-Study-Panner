export type SessionStatus = "planned" | "completed" | "skipped";

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type SubjectKey = "math" | "physics" | "cs" | "english";

export const SUBJECTS: Record<
  SubjectKey,
  { name: string; dot: string; bar: string; edge: string; tint: string }
> = {
  math: {
    name: "Mathematics",
    dot: "bg-accent",
    bar: "bg-accent",
    edge: "border-accent",
    tint: "bg-accent/15",
  },
  physics: {
    name: "Physics",
    dot: "bg-accent-2",
    bar: "bg-accent-2",
    edge: "border-accent-2",
    tint: "bg-accent-2/15",
  },
  cs: {
    name: "Computer Science",
    dot: "bg-teal",
    bar: "bg-teal",
    edge: "border-teal",
    tint: "bg-teal/15",
  },
  english: {
    name: "English",
    dot: "bg-amber",
    bar: "bg-amber",
    edge: "border-amber",
    tint: "bg-amber/15",
  },
};

export type Session = {
  id: string;
  day: Day;
  time: string;
  subject: SubjectKey;
  topic: string;
  minutes: number;
  status: SessionStatus;
};

export const INITIAL_SESSIONS: Session[] = [
  { id: "s1", day: "Mon", time: "08:00", subject: "math", topic: "Integration by parts", minutes: 90, status: "completed" },
  { id: "s2", day: "Mon", time: "11:00", subject: "cs", topic: "Graph traversal", minutes: 60, status: "completed" },
  { id: "s3", day: "Mon", time: "17:00", subject: "english", topic: "Essay structure", minutes: 45, status: "skipped" },

  { id: "s4", day: "Tue", time: "08:00", subject: "math", topic: "Differential equations", minutes: 90, status: "completed" },
  { id: "s5", day: "Tue", time: "10:00", subject: "physics", topic: "Rotational motion", minutes: 60, status: "planned" },
  { id: "s6", day: "Tue", time: "13:00", subject: "cs", topic: "Dynamic programming", minutes: 90, status: "planned" },
  { id: "s7", day: "Tue", time: "16:00", subject: "english", topic: "Comparative texts", minutes: 45, status: "planned" },

  { id: "s8", day: "Wed", time: "09:00", subject: "physics", topic: "Electric fields", minutes: 90, status: "planned" },
  { id: "s9", day: "Wed", time: "14:00", subject: "math", topic: "Series & sequences", minutes: 60, status: "planned" },
  { id: "s10", day: "Wed", time: "18:00", subject: "cs", topic: "Big-O analysis", minutes: 60, status: "planned" },

  { id: "s11", day: "Thu", time: "08:30", subject: "physics", topic: "Magnetism problems", minutes: 90, status: "planned" },
  { id: "s12", day: "Thu", time: "13:00", subject: "english", topic: "Critical reading", minutes: 45, status: "planned" },
  { id: "s13", day: "Thu", time: "16:00", subject: "math", topic: "Past paper 2023", minutes: 90, status: "planned" },

  { id: "s14", day: "Fri", time: "09:00", subject: "cs", topic: "Databases & SQL", minutes: 90, status: "planned" },
  { id: "s15", day: "Fri", time: "12:00", subject: "physics", topic: "Thermodynamics", minutes: 60, status: "planned" },
  { id: "s16", day: "Fri", time: "17:00", subject: "english", topic: "Essay draft", minutes: 60, status: "planned" },

  { id: "s17", day: "Sat", time: "10:00", subject: "math", topic: "Mixed revision", minutes: 120, status: "planned" },
  { id: "s18", day: "Sat", time: "15:00", subject: "physics", topic: "Exam simulation", minutes: 90, status: "planned" },

  { id: "s19", day: "Sun", time: "11:00", subject: "cs", topic: "Project review", minutes: 60, status: "planned" },
];

export const EXAMS = [
  { subject: "physics" as SubjectKey, title: "Physics — Paper 1", days: 4, readiness: 45 },
  { subject: "math" as SubjectKey, title: "Mathematics — Midterm", days: 11, readiness: 68 },
  { subject: "cs" as SubjectKey, title: "Computer Science — Theory", days: 18, readiness: 52 },
  { subject: "english" as SubjectKey, title: "English — Literature", days: 25, readiness: 38 },
];

export const TODAY: Day = "Tue";

export function subjectStats(sessions: Session[]) {
  return (Object.keys(SUBJECTS) as SubjectKey[]).map((key) => {
    const all = sessions.filter((s) => s.subject === key);
    const done = all.filter((s) => s.status === "completed");
    return {
      key,
      name: SUBJECTS[key].name,
      total: all.length,
      done: done.length,
      percent: all.length ? Math.round((done.length / all.length) * 100) : 0,
      hours: Math.round((done.reduce((a, s) => a + s.minutes, 0) / 60) * 10) / 10,
    };
  });
}

export function overallStats(sessions: Session[]) {
  const completed = sessions.filter((s) => s.status === "completed");
  const remaining = sessions.filter((s) => s.status === "planned");
  return {
    completed: completed.length,
    remaining: remaining.length,
    skipped: sessions.filter((s) => s.status === "skipped").length,
    total: sessions.length,
    percent: sessions.length ? Math.round((completed.length / sessions.length) * 100) : 0,
    hoursDone: Math.round((completed.reduce((a, s) => a + s.minutes, 0) / 60) * 10) / 10,
    hoursPlanned: Math.round((sessions.reduce((a, s) => a + s.minutes, 0) / 60) * 10) / 10,
  };
}
