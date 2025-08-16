import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";

/** Simple theme manager: saves to localStorage + toggles `dark` class */
function useThemeSetting() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
  );

  React.useEffect(() => {
    const root = document.documentElement;
    const apply = (t: "light" | "dark" | "system") => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };
    apply(theme);

    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") document.documentElement.classList.toggle("dark", e.matches);
    };
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, [theme]);

  const changeTheme = (t: "light" | "dark" | "system") => {
    setTheme(t);
    localStorage.setItem("theme", t);
    const root = document.documentElement;
    if (t === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", t === "dark");
    }
  };

  return { theme, changeTheme };
}

export function SettingsDialog() {
  const { theme, changeTheme } = useThemeSetting();

  // Mock form state (wire these up to your backend as needed)
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [program, setProgram] = React.useState("");
  const [yearLevel, setYearLevel] = React.useState<number | "">("");

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  // Preferences
  const [denseUI, setDenseUI] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [showTips, setShowTips] = React.useState(true);
  const [pushNotifs, setPushNotifs] = React.useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate + persist as needed
    // ...
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your account and preferences.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6">
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="preferences">User Preferences</TabsTrigger>
            </TabsList>

            {/* USER TAB */}
            <TabsContent value="user" className="space-y-6">
              {/* Profile */}
              <section className="space-y-3">
                <h3 className="text-sm font-medium">Profile</h3>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="displayName">Nickname</Label>
                    <Input
                      id="displayName"
                      placeholder="Enter your nickname"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="e.g. 2025-000123"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="program">Program</Label>
                    <Input
                      id="program"
                      placeholder="e.g. BS Computer Science"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="year">Year Level</Label>
                    <Input
                      id="year"
                      type="number"
                      min={1}
                      max={6}
                      placeholder="e.g. 2"
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                </div>
              </section>

              {/* Security */}
              <section className="space-y-3">
                <h3 className="text-sm font-medium">Security</h3>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* PREFERENCES TAB */}
            <TabsContent value="preferences" className="space-y-6">
              {/* Appearance */}
              <section className="space-y-3">
                <h3 className="text-sm font-medium">Appearance</h3>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={(v) => changeTheme(v as "light" | "dark" | "system")}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <Label htmlFor="denseUI">Compact Mode</Label>
                      <p className="text-xs text-muted-foreground">Reduce paddings and spacing.</p>
                    </div>
                    <Switch id="denseUI" checked={denseUI} onCheckedChange={setDenseUI} />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <Label htmlFor="reduceMotion">Reduce Motion</Label>
                      <p className="text-xs text-muted-foreground">Limit animations and transitions.</p>
                    </div>
                    <Switch id="reduceMotion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <Label htmlFor="showTips">Show UI Tips</Label>
                      <p className="text-xs text-muted-foreground">Helpful hints in the interface.</p>
                    </div>
                    <Switch id="showTips" checked={showTips} onCheckedChange={setShowTips} />
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section className="space-y-3">
                <h3 className="text-sm font-medium">Notifications</h3>
                <Separator />
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <Label htmlFor="pushNotifs">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Assignments & announcements.</p>
                  </div>
                  <Switch id="pushNotifs" checked={pushNotifs} onCheckedChange={setPushNotifs} />
                </div>
              </section>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
