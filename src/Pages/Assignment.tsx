// =====================================
// src/Pages/Assignment.tsx
// =====================================
import * as React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, Upload, X, Info, Calendar, Gauge } from "lucide-react";
import { TopNav } from "@/components/ui/common/TopNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- Types
type Submission = {
  id: string;
  fileName: string;
  sizeBytes: number;
  submittedAt: string; // ISO
  fileUrl?: string;     // object URL for preview/download
};

type AssignmentDetail = {
  id: string;
  title: string;
  courseCode: string;
  moduleTitle: string;
  instructions: string[];
  startAt: string;
  deadlineAt: string;
  allowedSubmissions: number;
  submissions: Submission[];
  status: "open" | "grading" | "closed";
  gradePercent: number | null;
  noOfStudentSubmissions?: number;
};

// --- Mock DB (same as before)
const ASSIGNMENTS: Record<string, AssignmentDetail> = {
  "cs201-array-drills": {
    id: "cs201-array-drills",
    title: "Array Drills",
    courseCode: "CS201",
    moduleTitle: "Arrays & Lists",
    instructions: [
      "Implement functions to insert, delete, and search in dynamic arrays.",
      "Time each operation and report complexities.",
      "Submit a single .zip with your code and README.",
    ],
    startAt: "2025-08-01T08:00:00Z",
    deadlineAt: "2025-08-20T23:59:00Z",
    allowedSubmissions: 2,
    submissions: [],
    status: "open",
    gradePercent: null,
    noOfStudentSubmissions: 128,
  },
  "cs201-list-ops": {
    id: "cs201-list-ops",
    title: "List Ops",
    courseCode: "CS201",
    moduleTitle: "Arrays & Lists",
    instructions: [
      "Build singly/doubly linked list APIs.",
      "Provide unit tests using your preferred framework.",
    ],
    startAt: "2025-08-03T08:00:00Z",
    deadlineAt: "2025-08-25T23:59:00Z",
    allowedSubmissions: 2,
    submissions: [],
    status: "open",
    gradePercent: null,
    noOfStudentSubmissions: 123,
  },
  "cs201-queue-sim": {
    id: "cs201-queue-sim",
    title: "Queue Simulator",
    courseCode: "CS201",
    moduleTitle: "Stacks & Queues",
    instructions: [
      "Simulate queue operations with different scheduling policies.",
      "Record average wait times and throughput.",
      "Submit a PDF report + source code.",
    ],
    startAt: "2025-08-05T08:00:00Z",
    deadlineAt: "2025-08-28T23:59:00Z",
    allowedSubmissions: 1,
    submissions: [],
    status: "open",
    gradePercent: null,
    noOfStudentSubmissions: 97,
  },
  "cs201-bst-basics": {
    id: "cs201-bst-basics",
    title: "BST Basics",
    courseCode: "CS201",
    moduleTitle: "Trees & Graphs",
    instructions: ["Implement BST insert/search/delete.", "Analyze best/worst-case paths."],
    startAt: "2025-08-10T08:00:00Z",
    deadlineAt: "2025-08-30T23:59:00Z",
    allowedSubmissions: 2,
    submissions: [],
    status: "open",
    gradePercent: null,
    noOfStudentSubmissions: 76,
  },
  "des110-flex-demo": {
    id: "des110-flex-demo",
    title: "Flex Demo Page",
    courseCode: "DES110",
    moduleTitle: "Flexbox Layout",
    instructions: ["Create a responsive page using only Flexbox.", "Attach a short Loom demo."],
    startAt: "2025-08-02T08:00:00Z",
    deadlineAt: "2025-08-18T23:59:00Z",
    allowedSubmissions: 3,
    submissions: [],
    status: "open",
    gradePercent: null,
    noOfStudentSubmissions: 102,
  },
  "des110-color-tokens": {
    id: "des110-color-tokens",
    title: "Color Tokens",
    courseCode: "DES110",
    moduleTitle: "Color & Contrast",
    instructions: ["Define a color token system.", "Show AA/AAA contrast proofs."],
    startAt: "2025-08-06T08:00:00Z",
    deadlineAt: "2025-08-25T23:59:00Z",
    allowedSubmissions: 2,
    submissions: [],
    status: "open",
    gradePercent: null,
  },
  "cs210-join-practice": {
    id: "cs210-join-practice",
    title: "Join Practice",
    courseCode: "CS210",
    moduleTitle: "SQL Joins",
    instructions: ["Solve the join kata set.", "Include EXPLAIN plans."],
    startAt: "2025-08-01T08:00:00Z",
    deadlineAt: "2025-08-21T23:59:00Z",
    allowedSubmissions: 2,
    submissions: [],
    status: "open",
    gradePercent: null,
  },
  "cs210-explain-plan": {
    id: "cs210-explain-plan",
    title: "Explain Plan",
    courseCode: "CS210",
    moduleTitle: "Indexes & Query Plans",
    instructions: ["Collect query plans with/without indexes.", "Compare costs and latency."],
    startAt: "2025-08-09T08:00:00Z",
    deadlineAt: "2025-08-29T23:59:00Z",
    allowedSubmissions: 1,
    submissions: [],
    status: "open",
    gradePercent: null,
  },
  "math130-set-proofs-1": {
    id: "math130-set-proofs-1",
    title: "Set Proofs 1",
    courseCode: "MATH130",
    moduleTitle: "Set Theory Basics",
    instructions: ["Prove the given set identities.", "Submit as a single PDF."],
    startAt: "2025-08-04T08:00:00Z",
    deadlineAt: "2025-08-22T23:59:00Z",
    allowedSubmissions: 2,
    submissions: [],
    status: "open",
    gradePercent: null,
  },
};

// --- helpers
function formatDT(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}
function bytesPretty(n: number) {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

// donut
function GradeDonut({ percent }: { percent: number }) {
  const size = 120;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" opacity={0.15} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold">
        {percent}%
      </text>
    </svg>
  );
}

export default function AssignmentPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const studentName = "Soytii";
  const moduleName = "Assignment";

  const [db, setDb] = React.useState(ASSIGNMENTS);
  const item = db[assignmentId ?? ""];

  const [open, setOpen] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadPct, setUploadPct] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputKey = React.useRef(0);
  const uploadTimerRef = React.useRef<number | null>(null);

  if (!item) {
    return (
      <div className="min-h-dvh bg-background">
        <TopNav studentName={studentName} moduleName={moduleName} />
        <main className="p-6 space-y-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 size-4" /> Back
          </Button>
          <div className="text-sm text-muted-foreground">Assignment not found.</div>
        </main>
      </div>
    );
  }

  const hasSubmission = item.submissions.length > 0;
  const canSubmit = item.status === "open" && item.submissions.length < item.allowedSubmissions;

  // input change
  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };
  // drop
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (uploading) return;
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  // fully clear current selection & reset input so same file can be reselected
  const clearSelectedFile = () => {
    setFile(null);
    setUploadPct(0);
    setUploading(false);
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // force re-mount of input to ensure change fires for same file again
    fileInputKey.current += 1;
  };

  const startUpload = () => {
    if (!file) return;
    setUploading(true);
    setUploadPct(0);

    const fileSnap = file; // capture

    uploadTimerRef.current = window.setInterval(() => {
      setUploadPct((prev) => {
        const next = Math.min(prev + 7, 100);
        if (next >= 100) {
          if (uploadTimerRef.current) {
            clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = null;
          }
          // add submission when "uploaded"
          setDb((prevDb) => {
            const nextDb = { ...prevDb };
            const cur = nextDb[item.id];
            const fileUrl = URL.createObjectURL(fileSnap);
            const newSubmission: Submission = {
              id: crypto.randomUUID(),
              fileName: fileSnap.name,
              sizeBytes: fileSnap.size,
              submittedAt: new Date().toISOString(),
              fileUrl,
            };
            nextDb[item.id] = {
              ...cur,
              submissions: [...cur.submissions, newSubmission],
              status: "grading",
            };
            return nextDb;
          });
          setUploading(false);
          setOpen(false);    // close dialog
          setFile(null);     // clear selection
          setUploadPct(0);
        }
        return next;
      });
    }, 160) as unknown as number;
  };

  return (
    <div className="min-h-dvh bg-background">
      <TopNav studentName={studentName} moduleName={`${item.title}`} />

      <main className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="shrink-0">
                <Link to={`/courses/${encodeURIComponent(item.courseCode)}/modules`}>
                  <ArrowLeft className="mr-2 size-4" />
                  Back to {item.courseCode} Modules
                </Link>
              </Button>
            </div>

            {/* left group + code at right */}
            <div className="flex items-center gap-2">
              <Badge variant={item.status === "open" ? "default" : "secondary"}>
                {item.status === "open" ? "Open" : item.status === "grading" ? "Grading period" : "Closed"}
              </Badge>
              <Badge variant="outline">Allowed submissions: {item.allowedSubmissions}</Badge>
              <Badge variant="outline">Your submissions: {item.submissions.length}</Badge>
              <Badge variant="secondary" className="uppercase">
                {item.courseCode}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">{item.title}</h1>
              <p className="text-sm text-muted-foreground">Module: {item.moduleTitle}</p>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Instructions + Submission history + Submit + Timeline */}
          <section className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-muted-foreground" />
                <h2 className="font-semibold">Instructions</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                {item.instructions.map((s, i) => (
                  <li key={i} className="text-sm">{s}</li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Submissions list */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <h2 className="font-semibold">Submissions</h2>
              </div>

              {item.submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-2">
                  {item.submissions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{s.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {bytesPretty(s.sizeBytes)} • Submitted {formatDT(s.submittedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {s.fileUrl && (
                          <>
                            <a
                              href={s.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View
                            </a>
                            <a
                              href={s.fileUrl}
                              download={s.fileName}
                              className="text-primary hover:underline text-sm"
                            >
                              Download
                            </a>
                          </>
                        )}
                        <Badge variant="outline">Uploaded</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit area */}
            <div className="pt-2">
              <Dialog
                open={open}
                onOpenChange={(v) => {
                  setOpen(v);
                  if (!v) {
                    clearSelectedFile(); // always reset so same file can be chosen again
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button disabled={!canSubmit} title={!canSubmit ? "Submission disabled during grading or limit reached" : ""}>
                    <Upload className="mr-2 size-4" />
                    {item.submissions.length === 0 ? "Submit work" : "Submit another file"}
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Upload your work</DialogTitle>
                  </DialogHeader>

                  {/* Dropzone / Selected file view */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!uploading && !file) setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => {
                      if (!file && !uploading) fileInputRef.current?.click();
                    }}
                    className={cn(
                      "mt-2 rounded-md border p-6 text-center select-none",
                      dragOver ? "border-dashed bg-muted/40" : "bg-card",
                      file ? "cursor-default" : "cursor-pointer"
                    )}
                    role="button"
                    aria-label={file ? "File selected" : "Open file picker"}
                  >
                    {/* If a file is selected, show ONLY the file chip + (if uploading) progress */}
                    {file ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-md border px-3 py-2">
                          <span className="text-sm font-medium truncate max-w-[16rem]" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground">• {bytesPretty(file.size)}</span>
                          <button
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearSelectedFile();
                            }}
                            aria-label="Remove selected file"
                            disabled={uploading}
                          >
                            <X className="size-4" />
                          </button>
                        </div>

                        {uploading && (
                          <div className="w-full max-w-xs space-y-1.5">
                            <Progress value={uploadPct} />
                            <div className="text-xs text-muted-foreground">{Math.round(uploadPct)}%</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // No file yet: show pick UI centered with link-like "Choose file"
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="size-6" />
                        <p className="text-sm">
                          <button
                            type="button"
                            className="text-primary underline font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Choose file
                          </button>{" "}
                          <span className="text-muted-foreground">No file chosen</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Or drag &amp; drop here</p>
                      </div>
                    )}

                    {/* Hidden file input (key forces remount so the same file can be re-picked after cancel) */}
                    <input
                      key={fileInputKey.current}
                      ref={fileInputRef}
                      type="file"
                      onChange={onPickFile}
                      className="hidden"
                      aria-label="Choose file to upload"
                    />
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Cancel closes dialog and resets file/percentage so the same file can be chosen again
                        setOpen(false);
                      }}
                      disabled={uploading} // optional: keep enabled to act as "abort"; flip to !uploading if you want abort behavior
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={startUpload}
                      disabled={!file || uploading}
                    >
                      {uploading ? `Uploading… ${Math.round(uploadPct)}%` : "Submit"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Timeline & Quotas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <h2 className="font-semibold">Timeline & Quotas</h2>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Start</span>
                  <span className="font-medium">{formatDT(item.startAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">{formatDT(item.deadlineAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Your submissions</span>
                  <span className="font-medium">{item.submissions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Allowed submissions</span>
                  <span className="font-medium">{item.allowedSubmissions}</span>
                </div>
                {typeof item.noOfStudentSubmissions === "number" && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total submitted (class)</span>
                    <span className="font-medium">{item.noOfStudentSubmissions}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right: Status / Grade */}
          <aside className="rounded-lg border p-4 h-full min-h-[320px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">Status</h3>
            </div>

            <div className="flex-1 grid place-items-center">
              {hasSubmission ? (
                item.gradePercent !== null ? (
                  <div className="flex flex-col items-center gap-2">
                    <GradeDonut percent={item.gradePercent} />
                    <p className="text-sm text-muted-foreground">Final grade</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-28 grid place-items-center rounded-full border">
                      <span className="text-xs text-muted-foreground">Waiting for grade</span>
                    </div>
                    <Progress value={33} className="w-24" />
                    <p className="text-xs text-muted-foreground">Your submission is under review.</p>
                  </div>
                )
              ) : (
                <p className="text-sm text-muted-foreground">You don’t have any submissions yet.</p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
