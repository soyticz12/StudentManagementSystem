// =====================================
// src/pages/Profile.tsx
// =====================================
import * as React from "react";
import { FileText, GraduationCap, Mail, School, User, IdCard } from "lucide-react";
import { TopNav } from "@/components/ui/common/TopNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StudentProfile = {
  photoUrl?: string | null;
  studentNo: string;
  name: string;
  schoolEmail: string;
  personalEmail?: string | null;
  yearLevel: "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "5th Year";
  program: string; // e.g. "BSIT"
};

type AccomplishedCourse = {
  code: string;
  name: string;
  term: "Prelim" | "Midterms" | "Prefinals" | "Finals";
  units: number;
  grade: string | number;
};

type Achievement = {
  title: string;
  year: number | string;
  pdfUrl?: string | null;
  description?: string | null;
};

// Reusable row that always reserves an icon column so text aligns consistently
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1 text-muted-foreground shrink-0">{icon}</span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-semibold">{children}</div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const studentName = "Soytii";
  const moduleName = "Profile";

  const profile: StudentProfile = {
    photoUrl:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
    studentNo: "2025-001234",
    name: "Soytii D.",
    schoolEmail: "soytii.d@university.edu.ph",
    personalEmail: "soytii.dev@gmail.com",
    yearLevel: "4th Year",
    program: "BSIT",
  };

  const accomplished: AccomplishedCourse[] = [
    { code: "CS201", name: "Data Structures", term: "Prelim", units: 3, grade: "1.5" },
    { code: "CS210", name: "Database Systems", term: "Midterms", units: 3, grade: "1.75" },
    { code: "MATH130", name: "Discrete Mathematics", term: "Finals", units: 3, grade: "2.0" },
    { code: "DES110", name: "UI/UX Fundamentals", term: "Prefinals", units: 2, grade: "1.75" },
  ];

  const achievements: Achievement[] = [
    {
      title: "Dean’s Lister",
      year: 2024,
      pdfUrl: "/achievements/deans-list-2024.pdf",
      description: "Top 10% standing for the academic year.",
    },
    {
      title: "Hackathon Champion",
      year: 2025,
      pdfUrl: "/achievements/hackathon-2025-winner.pdf",
      description: "1st place in University HackFest (Web category).",
    },
    {
      title: "Community Outreach Volunteer",
      year: 2023,
      pdfUrl: "/achievements/outreach-certificate-2023.pdf",
      description: "50+ hours of tech tutoring for local high school.",
    },
  ];

  const totalUnits = accomplished.reduce((sum, c) => sum + c.units, 0);

  return (
    <div className="min-h-dvh bg-background">
      <TopNav studentName={studentName} moduleName={moduleName} />

      <main className="px-6 py-6 space-y-8">
        {/* Header */}
        <section className="w-full border-b pb-6">
          <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold mb-6">
            <GraduationCap className="size-6" />
            Student Profile
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
            <Avatar className="size-24">
              {profile.photoUrl ? (
                <AvatarImage src={profile.photoUrl} alt={`${profile.name} photo`} />
              ) : (
                <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 flex-1">
              <InfoRow icon={<IdCard className="size-4" />} label="Student No.">
                {profile.studentNo}
              </InfoRow>

              <InfoRow icon={<User className="size-4" />} label="Student Name">
                {profile.name}
              </InfoRow>

              <InfoRow icon={<Mail className="size-4" />} label="School Email">
                <a
                  className="text-primary hover:underline"
                  href={`mailto:${profile.schoolEmail}`}
                >
                  {profile.schoolEmail}
                </a>
              </InfoRow>

              <InfoRow icon={<Mail className="size-4" />} label="Personal Email">
                {profile.personalEmail ? (
                  <a
                    className="text-primary hover:underline"
                    href={`mailto:${profile.personalEmail}`}
                  >
                    {profile.personalEmail}
                  </a>
                ) : (
                  <span>—</span>
                )}
              </InfoRow>

              <InfoRow icon={<School className="size-4" />} label="Year Level">
                {profile.yearLevel}
              </InfoRow>

              <InfoRow icon={<School className="size-4" />} label="Program">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="uppercase">
                    {profile.program}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {profile.program === "BSIT"
                      ? "Bachelor of Science in Information Technology"
                      : ""}
                  </span>
                </div>
              </InfoRow>
            </div>
          </div>
        </section>

        {/* Tabs Body */}
        <section className="w-full">
          <Tabs defaultValue="units" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="units">Accomplished Units</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Accomplished Units */}
            <TabsContent value="units" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  All courses you’ve completed so far.
                </p>
                <Badge variant="outline">Total Units: {totalUnits}</Badge>
              </div>

              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-muted text-foreground font-semibold">
                      <TableHead className="w-[20%]">Code</TableHead>
                      <TableHead className="w-[40%]">Course</TableHead>
                      <TableHead className="w-[15%]">Term</TableHead>
                      <TableHead className="w-[10%] text-center">Units</TableHead>
                      <TableHead className="w-[15%] text-center">Final Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accomplished.map((c) => (
                      <TableRow key={c.code} className="h-14 hover:bg-muted/40">
                        <TableCell className="py-3 font-medium">{c.code}</TableCell>
                        <TableCell className="py-3">{c.name}</TableCell>
                        <TableCell className="py-3">{c.term}</TableCell>
                        <TableCell className="py-3 text-center">{c.units}</TableCell>
                        <TableCell className="py-3 text-center">{c.grade}</TableCell>
                      </TableRow>
                    ))}
                    {accomplished.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-10 text-center text-sm text-muted-foreground"
                        >
                          No accomplished units yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="mt-6">
              {achievements.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No achievements yet.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((a, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg bg-card text-card-foreground space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{a.title}</h3>
                        <Badge variant="secondary">{a.year}</Badge>
                      </div>
                      {a.description && (
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                      )}
                      <div>
                        {a.pdfUrl ? (
                          <a
                            href={a.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                          >
                            <FileText className="size-4" />
                            View Certificate (PDF)
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No PDF available
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
