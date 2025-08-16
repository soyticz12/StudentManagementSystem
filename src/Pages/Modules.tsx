import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, ArrowLeft, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { TopNav } from "../components/ui/common/TopNav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ModuleRow = {
  title: string;
  status: "Ongoing" | "Completed";
  score: number | null;
  progress: number;
  handoutUrl?: string | null;
  term: "Prelim" | "Midterms" | "Prefinals" | "Finals";
  assignments?: Array<{ title: string; url: string }>;
};

const MODULES_BY_COURSE: Record<string, Array<ModuleRow>> = {
  CS201: [
    {
      title: "Arrays & Lists",
      status: "Completed",
      score: 92,
      progress: 100,
      handoutUrl: "/handouts/cs201-arrays-lists.pdf",
      term: "Prelim",
      assignments: [
        { title: "Array Drills", url: "/assignments/cs201-array-drills" },
        { title: "List Ops", url: "/assignments/cs201-list-ops" },
      ],
    },
    {
      title: "Stacks & Queues",
      status: "Ongoing",
      score: null,
      progress: 40,
      handoutUrl: "/handouts/cs201-stacks-queues.pdf",
      term: "Midterms",
      assignments: [{ title: "Queue Simulator", url: "/assignments/cs201-queue-sim" }],
    },
    {
      title: "Trees & Graphs",
      status: "Ongoing",
      score: null,
      progress: 10,
      handoutUrl: null,
      term: "Prefinals",
      assignments: [{ title: "BST Basics", url: "/assignments/cs201-bst-basics" }],
    },
  ],
  DES110: [
    {
      title: "Flexbox Layout",
      status: "Ongoing",
      score: null,
      progress: 60,
      handoutUrl: "/handouts/des110-flexbox-layout.pdf",
      term: "Prelim",
      assignments: [{ title: "Flex Demo Page", url: "/assignments/des110-flex-demo" }],
    },
    {
      title: "Color & Contrast",
      status: "Ongoing",
      score: null,
      progress: 20,
      handoutUrl: null,
      term: "Midterms",
      assignments: [{ title: "Color Tokens", url: "/assignments/des110-color-tokens" }],
    },
  ],
  CS210: [
    {
      title: "SQL Joins",
      status: "Completed",
      score: 88,
      progress: 100,
      handoutUrl: "/handouts/cs210-sql-joins.pdf",
      term: "Prelim",
      assignments: [{ title: "Join Practice", url: "/assignments/cs210-join-practice" }],
    },
    {
      title: "Indexes & Query Plans",
      status: "Ongoing",
      score: null,
      progress: 30,
      handoutUrl: "/handouts/cs210-indexes-query-plans.pdf",
      term: "Finals",
      assignments: [{ title: "Explain Plan", url: "/assignments/cs210-explain-plan" }],
    },
  ],
  MATH130: [
    {
      title: "Set Theory Basics",
      status: "Ongoing",
      score: null,
      progress: 50,
      handoutUrl: "/handouts/math130-set-theory-basics.pdf",
      term: "Prelim",
      assignments: [{ title: "Set Proofs 1", url: "/assignments/math130-set-proofs-1" }],
    },
  ],
};

type SortKey = "title" | "status" | "progressScore" | null;
type SortDirection = "asc" | "desc" | null;

export function ModulesPage() {
  const { code } = useParams<{ code: string }>();

  const studentName = "Soytii";
  const courseCode = code ?? "";
  const moduleName = `Modules • ${courseCode}`;

  const modules = MODULES_BY_COURSE[courseCode] ?? [];

  // Sorting state
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
    if (!sortKey || !direction) return modules.slice();

    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    const statusRank: Record<ModuleRow["status"], number> = { Ongoing: 1, Completed: 2 };

    const valueOfProgressScore = (m: ModuleRow) =>
      m.status === "Completed" ? (m.score ?? 0) : m.progress;

    const arr = modules.slice().sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") {
        cmp = collator.compare(a.title, b.title);
      } else if (sortKey === "status") {
        cmp = statusRank[a.status] - statusRank[b.status];
      } else if (sortKey === "progressScore") {
        cmp = valueOfProgressScore(a) - valueOfProgressScore(b);
      }
      return direction === "asc" ? cmp : -cmp;
    });

    return arr;
  }, [modules, sortKey, direction]);

  const TERM_ORDER: ModuleRow["term"][] = ["Prelim", "Midterms", "Prefinals", "Finals"];
  const grouped = React.useMemo(() => {
    const groups: Record<ModuleRow["term"], ModuleRow[]> = {
      Prelim: [],
      Midterms: [],
      Prefinals: [],
      Finals: [],
    };
    for (const m of sorted) groups[m.term].push(m);
    return groups;
  }, [sorted]);

  const SortIndicator = ({ active, dir }: { active: boolean; dir: SortDirection }) => (
    <span className="ml-1 inline-flex flex-col justify-center">
      <span
        className={[
          "block border-x-[4px] border-x-transparent border-b-[6px] border-b-current leading-none",
          active && dir === "asc" ? "opacity-100" : "opacity-30",
        ].join(" ")}
      />
      <span
        className={[
          "mt-[2px] block border-x-[4px] border-x-transparent border-t-[6px] border-t-current leading-none",
          active && dir === "desc" ? "opacity-100" : "opacity-30",
        ].join(" ")}
      />
    </span>
  );

  const ariaSortFor = (key: Exclude<SortKey, null>): React.AriaAttributes["aria-sort"] => {
    if (sortKey !== key || !direction) return "none";
    return direction === "asc" ? "ascending" : "descending";
  };

  const defaultOpen = TERM_ORDER.filter((t) => grouped[t].length > 0);

  return (
    <div className="min-h-dvh bg-background">
      <TopNav studentName={studentName} moduleName={moduleName} />

      <main className="mx-auto max-w-none p-4 md:p-6 space-y-4 bg-background">
        {/* Header + Back button only (search removed) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2 text-base font-semibold">
            <BookOpen className="size-5" />
            <span className="truncate">Modules for {courseCode}</span>
          </div>

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/courses">
              <ArrowLeft className="mr-2 size-4" /> Back to Courses
            </Link>
          </Button>
        </div>

        {/* Accordion sections remain the same */}
        <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-4">
          {TERM_ORDER.map((term) => {
            const mods = grouped[term];
            if (!mods.length) return null;

            return (
              <AccordionItem
                key={term}
                value={term}
                className="border rounded-lg bg-card text-card-foreground"
              >
                <AccordionTrigger className="px-4 py-3 text-lg md:text-xl font-bold">
                  {term}
                </AccordionTrigger>

                <AccordionContent>
                  {/* MOBILE list */}
                  <div className="md:hidden space-y-3 px-4 pb-4">
                    {mods.map((m) => (
                      <div key={m.title} className="rounded-lg border bg-card text-card-foreground p-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium leading-tight">{m.title}</p>
                          <Badge variant={m.status === "Completed" ? "secondary" : "default"}>
                            {m.status}
                          </Badge>
                        </div>

                        {/* Assignments (inline links) */}
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Assignments: </span>
                          {m.assignments && m.assignments.length > 0 ? (
                            <span className="inline-flex flex-wrap gap-2">
                              {m.assignments.map((a, idx) => (
                                <a
                                  key={idx}
                                  href={a.url}
                                  className="hover:underline text-primary"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {a.title}
                                </a>
                              ))}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                          {m.status === "Completed" ? (
                            <Badge variant="secondary">Score: {m.score}</Badge>
                          ) : (
                            <Progress value={m.progress} />
                          )}

                          {m.handoutUrl ? (
                            <a
                              href={m.handoutUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <FileText className="size-4" /> PDF
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP table */}
                  <div className="hidden md:block overflow-x-auto px-2 pb-4">
                    <Table className="w-full table-fixed">
                      <TableHeader>
                        {/* Header row uses bg-muted and text-foreground for dark mode parity */}
                        <TableRow className="bg-muted text-foreground font-semibold">
                          <TableHead className="w-[22%]" aria-sort={ariaSortFor("title")}>
                            <button
                              onClick={() => toggleSort("title")}
                              className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                            >
                              Module <SortIndicator active={sortKey === "title"} dir={direction} />
                            </button>
                          </TableHead>

                          <TableHead className="w-[18%]">Handout</TableHead>

                          <TableHead className="w-[14%] text-center" aria-sort={ariaSortFor("status")}>
                            <button
                              onClick={() => toggleSort("status")}
                              className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                            >
                              Status <SortIndicator active={sortKey === "status"} dir={direction} />
                            </button>
                          </TableHead>

                          {/* Assignments column */}
                          <TableHead className="w-[26%]">Assignments</TableHead>

                          <TableHead className="w-[20%]" aria-sort={ariaSortFor("progressScore")}>
                            <button
                              onClick={() => toggleSort("progressScore")}
                              className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
                            >
                              Progress / Score <SortIndicator active={sortKey === "progressScore"} dir={direction} />
                            </button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {mods.map((m) => (
                          <TableRow key={m.title} className="h-16 hover:bg-muted/40">
                            <TableCell className="font-medium py-4">{m.title}</TableCell>

                            <TableCell className="py-4">
                              {m.handoutUrl ? (
                                <a
                                  href={m.handoutUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  <FileText className="size-4" /> Handout (PDF)
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>

                            <TableCell className="py-4 text-center">
                              <Badge variant={m.status === "Completed" ? "secondary" : "default"}>
                                {m.status}
                              </Badge>
                            </TableCell>

                            <TableCell className="py-4">
                              {m.assignments && m.assignments.length > 0 ? (
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                  {m.assignments.map((a, idx) => (
                                    <a
                                      key={idx}
                                      href={a.url}
                                      className="text-primary hover:underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {a.title}
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>

                            <TableCell className="py-4">
                              {m.status === "Completed" ? (
                                <Badge variant="secondary">Score: {m.score}</Badge>
                              ) : (
                                <Progress value={m.progress} />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </main>
    </div>
  );
}
