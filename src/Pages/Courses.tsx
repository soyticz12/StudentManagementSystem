import * as React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TopNav } from "../components/ui/common/TopNav";

type CourseRow = {
  name: string;
  code: string;
  professor: string;
  schedule: string;   // e.g. "Wed 3:00–5:00 PM"
  room: string;       // e.g. "Room 201"
  units: number;
  status: "Ongoing" | "Completed";
};

type SortKey = keyof CourseRow | null;
type SortDirection = "asc" | "desc" | null;

export function CoursesPage() {
  const navigate = useNavigate();

  const studentName = "Soytii";
  const moduleName = "Courses";

  const data: CourseRow[] = [
    { name: "Data Structures", code: "CS201", professor: "Dr. Santos", schedule: "Wed 3:00–5:00 PM", room: "Room 201", units: 3, status: "Ongoing" },
    { name: "UI/UX Intro",     code: "DES110", professor: "Prof. Reyes", schedule: "Tue 1:00–3:00 PM", room: "Room 305", units: 2, status: "Ongoing" },
    { name: "Database Systems",code: "CS210", professor: "Dr. Cruz", schedule: "Thu 9:00–11:00 AM", room: "Lab 2", units: 3, status: "Completed" },
    { name: "Discrete Math",   code: "MATH130", professor: "Prof. Dela Peña", schedule: "Mon 10:00–12:00 PM", room: "Room 104", units: 3, status: "Ongoing" },
  ];

  const [sortKey, setSortKey] = React.useState<SortKey>(null);
  const [direction, setDirection] = React.useState<SortDirection>(null);

  const toggleSort = (key: Exclude<SortKey, null>) => {
    if (sortKey !== key) {
      setSortKey(key);
      setDirection("desc");
    } else {
      setDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    }
  };

  const sorted = React.useMemo(() => {
    if (!sortKey || !direction) return data.slice();

    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    const statusRank: Record<CourseRow["status"], number> = { Ongoing: 1, Completed: 2 };

    const arr = data.slice().sort((a, b) => {
      const va = a[sortKey] as any;
      const vb = b[sortKey] as any;

      let cmp = 0;
      if (sortKey === "units") {
        cmp = (va as number) - (vb as number);
      } else if (sortKey === "status") {
        cmp = statusRank[va as CourseRow["status"]] - statusRank[vb as CourseRow["status"]];
      } else {
        cmp = collator.compare(String(va), String(vb));
      }

      return direction === "asc" ? cmp : -cmp;
    });

    return arr;
  }, [data, sortKey, direction]);

  const goToCourseModules = (code: string) => {
    navigate(`/courses/${encodeURIComponent(code)}/modules`);
  };

  const SortIndicator = ({ active, dir }: { active: boolean; dir: SortDirection }) => (
    <span className="ml-1 inline-flex flex-col justify-center">
      <span
        className={[
          "block border-x-[4px] border-x-transparent border-b-[6px] border-b-current leading-none",
          active && dir === "asc" ? "opacity-100" : "opacity-30",
        ].join(" ")}
        style={{ width: 0, height: 0 }}
      />
      <span
        className={[
          "mt-[2px] block border-x-[4px] border-x-transparent border-t-[6px] border-t-current leading-none",
          active && dir === "desc" ? "opacity-100" : "opacity-30",
        ].join(" ")}
        style={{ width: 0, height: 0 }}
      />
    </span>
  );

  const ariaSortFor = (key: Exclude<SortKey, null>): React.AriaAttributes["aria-sort"] => {
    if (sortKey !== key || !direction) return "none";
    return direction === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="min-h-dvh bg-background">
      <TopNav studentName={studentName} moduleName={moduleName} />

      {/* use bg-background so the page canvas follows light/dark tokens */}
      <main className="mx-auto max-w-none p-4 md:p-6 space-y-4 bg-background">
        {/* Header with divider (border token respects dark mode) */}
        <div className="border-b pb-3">
          <div className="flex items-center gap-2 text-base font-semibold">
            <BookOpen className="size-5" />
            <span>Manage and browse your enrolled courses</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              {/* header uses bg-muted + text-foreground so it adapts to dark mode */}
              <TableRow className="bg-muted text-foreground font-semibold">
                <TableHead aria-sort={ariaSortFor("name")}>
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                  >
                    Course
                    <SortIndicator active={sortKey === "name"} dir={direction} />
                  </button>
                </TableHead>

                <TableHead aria-sort={ariaSortFor("code")}>
                  <button
                    type="button"
                    onClick={() => toggleSort("code")}
                    className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                  >
                    Code
                    <SortIndicator active={sortKey === "code"} dir={direction} />
                  </button>
                </TableHead>

                <TableHead aria-sort={ariaSortFor("professor")}>
                  <button
                    type="button"
                    onClick={() => toggleSort("professor")}
                    className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                  >
                    Professor
                    <SortIndicator active={sortKey === "professor"} dir={direction} />
                  </button>
                </TableHead>

                <TableHead>Schedule</TableHead>
                <TableHead>Room No.</TableHead>

                <TableHead className="text-center" aria-sort={ariaSortFor("units")}>
                  <button
                    type="button"
                    onClick={() => toggleSort("units")}
                    className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                  >
                    Units
                    <SortIndicator active={sortKey === "units"} dir={direction} />
                  </button>
                </TableHead>

                <TableHead className="text-center" aria-sort={ariaSortFor("status")}>
                  <button
                    type="button"
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                  >
                    Status
                    <SortIndicator active={sortKey === "status"} dir={direction} />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sorted.map((c) => (
                <TableRow
                  key={c.code}
                  className="h-16 hover:bg-muted/40 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => goToCourseModules(c.code)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goToCourseModules(c.code);
                    }
                  }}
                  aria-label={`Open modules for ${c.name}`}
                >
                  <TableCell className="font-medium py-4">{c.name}</TableCell>
                  <TableCell className="py-4">{c.code}</TableCell>
                  <TableCell className="py-4">{c.professor}</TableCell>
                  <TableCell className="py-4">{c.schedule}</TableCell>
                  <TableCell className="py-4">{c.room}</TableCell>
                  <TableCell className="py-4 text-center">{c.units}</TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge variant={c.status === "Completed" ? "secondary" : "default"}>{c.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}

              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No courses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
