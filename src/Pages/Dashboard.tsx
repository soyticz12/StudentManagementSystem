// ===============================
// src/pages/StudentDashboard.tsx
// ===============================
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users2,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// shared top nav
import { TopNav } from "@/components/ui/common/TopNav";

// Sample data
const kpis = [
  { title: "My Courses", value: "6", change: "+1 new", icon: BookOpen, href: "/courses" },
  { title: "Completed Modules", value: "14", change: "+2 this week", icon: CheckCircle2, href: "/modules/completed" },
  { title: "Study Time", value: "12h", change: "+1.5h", icon: Clock3 }, // no link
  { title: "Active Classmates", value: "128", change: "+6 online", icon: Users2, href: "/classmates" },
];

const recentModules = [
  { module: "Mathematics Handout.pdf", type: "Handout", time: "2h ago" },
  { module: "History Lecture Video", type: "Video", time: "5h ago" },
  { module: "Science Quiz Review", type: "Quiz", time: "Yesterday" },
  { module: "Programming Assignment 1", type: "Assignment", time: "2 days ago" },
];

const nextClasses = [
  { course: "Mathematics", time: "Today 10:00 AM", room: "Room 201" },
  { course: "History", time: "Today 1:00 PM", room: "Room 305" },
  { course: "Computer Science", time: "Tomorrow 8:00 AM", room: "Lab 2" },
];

const studentNeeds = [
  { need: "Tutoring Session", detail: "Requested help for Algebra" },
  { need: "Extension Request", detail: "Programming Assignment 1 deadline" },
  { need: "Feedback", detail: "Essay draft for History" },
];

const deadlines = [
  { title: "Quiz 2: Arrays & Lists", course: "Data Structures", due: "Today, 11:59 PM" },
  { title: "Assignment: Flexbox Layout", course: "UI/UX Intro", due: "Aug 18" },
  { title: "Lab: SQL Joins", course: "DB Systems", due: "Aug 19" },
];

function FloatingQuickNav() {
  const [open, setOpen] = React.useState(false);

  const items = [
    { to: "/courses", label: "My Courses", icon: BookOpen },
    { to: "/modules", label: "Completed Modules", icon: CheckCircle2 },
    { to: "/classmates", label: "Active Classmates", icon: Users2 },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="relative flex flex-col items-end gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="mb-2 w-56 space-y-2"
            >
              {items.map((it, idx) => (
                <motion.div
                  key={it.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Button asChild className="w-full justify-start gap-2 shadow-lg">
                    <Link to={it.to} aria-label={it.label}>
                      <it.icon className="size-4" />
                      {it.label}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="lg"
          onClick={() => setOpen((s) => !s)}
          className="rounded-full size-14 shadow-xl"
          aria-label={open ? "Close quick navigation" : "Open quick navigation"}
        >
          <ChevronUp className={`size-6 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const studentName = "Soytii";
  const moduleName = "Dashboard";

  return (
    <div className="min-h-dvh bg-background">
      {/* Shared TopNav */}
      <TopNav studentName={studentName} moduleName={moduleName} />

      {/* was bg-gray-50, now token-based to respect dark mode */}
      <main className="mx-auto max-w-none p-4 md:p-6 space-y-6 bg-background">
        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, idx) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="size-5 text-muted-foreground" />
                </CardHeader>
                <Separator />
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                      <p className="text-xs text-muted-foreground">{kpi.change}</p>
                    </div>
                    {kpi.href && (
                      <Button size="sm" variant="outline" asChild aria-label={`Open ${kpi.title}`}>
                        <Link to={kpi.href} className="inline-flex items-center gap-1">
                          Open <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Recent Modules & Next Classes */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Recently Opened Modules */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5" /> Recently Opened Modules
              </CardTitle>
              <CardDescription>What you viewed last</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted text-foreground">
                    <TableHead>Module</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Opened</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentModules.map((m) => (
                    <TableRow key={m.module} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{m.module}</TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell>{m.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Next Classes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5" /> Next Classes
              </CardTitle>
              <CardDescription>Your upcoming schedule</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
              {nextClasses.map((c) => (
                <div key={c.course} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium leading-tight">{c.course}</p>
                    <p className="text-sm text-muted-foreground">{c.time}</p>
                  </div>
                  <Badge variant="secondary">{c.room}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Deadlines & Student Needs */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Upcoming Deadlines */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5" /> Upcoming Deadlines
              </CardTitle>
              <CardDescription>Assignments & quizzes due soon</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
              {deadlines.map((d) => (
                <div key={d.title} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium leading-tight">{d.title}</p>
                    <p className="text-sm text-muted-foreground">{d.course}</p>
                  </div>
                  <Badge variant="secondary">{d.due}</Badge>
                </div>
              ))}
              <Separator />
              <Button variant="outline" className="w-full" asChild>
                <Link to="/calendar">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Student Needs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users2 className="size-5" /> Things I Need
              </CardTitle>
              <CardDescription>Requests & support items</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
              {studentNeeds.map((n) => (
                <div key={n.need} className="space-y-1">
                  <p className="font-medium leading-tight">{n.need}</p>
                  <p className="text-sm text-muted-foreground">{n.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>

      <FloatingQuickNav />
    </div>
  );
}
