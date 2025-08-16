// =====================================
// src/pages/Classmates.tsx
// =====================================
import * as React from "react";
import { Users2, Search, Circle, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TopNav } from "@/components/ui/common/TopNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Mate = {
  name: string;
  status: "online" | "offline" | "away";
  lastOnline: string;              // e.g. "2h ago"
  lastMsg: { text: string; from: "me" | "them" };
};

export function ClassmatesPage() {
  const studentName = "Soytii";
  const moduleName = "Classmates";

  const [query, setQuery] = React.useState("");
  const [myStatus, setMyStatus] = React.useState<"online" | "offline" | "away">("online");

  const classmates: Mate[] = [
    { name: "Ana D.",   status: "online",  lastOnline: "Just now",  lastMsg: { text: "See you later!", from: "them" } },
    { name: "Brian P.", status: "offline", lastOnline: "Yesterday", lastMsg: { text: "Hi", from: "me" } },
    { name: "Cara L.",  status: "online",  lastOnline: "5m ago",    lastMsg: { text: "Okay, thanks!", from: "them" } },
    { name: "Diego T.", status: "away",    lastOnline: "3d ago",    lastMsg: { text: "You got this!", from: "me" } },
  ];

  const filtered = classmates.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const presenceText = (s: Mate["status"]) =>
    s === "online" ? "Available now" : s === "away" ? "Away" : "Offline";

  // Theme-aware badges (add dark: variants so they read well in dark mode)
  const statusClasses = (s: Mate["status"]) => {
    switch (s) {
      case "online":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800";
      case "away":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-muted text-foreground border";
    }
  };

  const Dot = ({ color }: { color: "green" | "red" | "gray" }) => (
    <Circle
      className={`size-3 ${
        color === "green" ? "text-emerald-500" : color === "red" ? "text-amber-500" : "text-muted-foreground"
      }`}
      fill="currentColor"
    />
  );

  const renderLastMsg = (m: Mate["lastMsg"]) =>
    `${m.from === "me" ? "You: " : ""}${m.text}`;

  return (
    <div className="min-h-dvh bg-background">
      <TopNav studentName={studentName} moduleName={moduleName} />

      <main className="mx-auto max-w-none p-4 md:p-6 space-y-4 bg-background">
        {/* Header + controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2 text-base font-semibold">
            <Users2 className="size-5" />
            <span>Browse and connect with your classmates</span>
          </div>

          <div className="flex w-full md:w-auto flex-wrap items-center gap-2">
            {/* Search (no forced white bg; respects theme) */}
            <div className="relative flex-1 min-w-0">
              <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 w-full sm:w-72"
                placeholder="Search classmates"
              />
            </div>

            {/* Create Group (use primary token instead of hard-coded greens) */}
            <Button className="w-full sm:w-auto">
              <UserPlus className="size-4 mr-2" />
              Create Group
            </Button>

            {/* My status selector (no forced white bg) */}
            <Select value={myStatus} onValueChange={(v) => setMyStatus(v as Mate["status"])}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="My status" aria-label={`My status is ${myStatus}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">
                  <span className="inline-flex items-center gap-2">
                    <Dot color="green" /> Online
                  </span>
                </SelectItem>
                <SelectItem value="away">
                  <span className="inline-flex items-center gap-2">
                    <Dot color="red" /> Away
                  </span>
                </SelectItem>
                <SelectItem value="offline">
                  <span className="inline-flex items-center gap-2">
                    <Dot color="gray" /> Offline
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* DESKTOP table (md and up) */}
        <div className="hidden md:block">
          <Table className="w-full">
            <TableHeader>
              {/* Theme-aware header */}
              <TableRow className="bg-muted text-foreground font-semibold">
                <TableHead className="w-[25%]">Name</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[20%]">Last Online</TableHead>
                <TableHead className="w-[40%]">Last Chat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.name} className="h-16 hover:bg-muted/40">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {c.name.split(" ")[0].slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-tight">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{presenceText(c.status)}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge className={`capitalize ${statusClasses(c.status)}`} variant="outline">
                      {c.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4">{c.lastOnline}</TableCell>
                  <TableCell className="py-4 truncate max-w-[28ch] text-muted-foreground">
                    {renderLastMsg(c.lastMsg)}
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    No classmates found.
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
