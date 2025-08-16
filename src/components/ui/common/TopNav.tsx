import * as React from "react";
import { GraduationCap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationMenu } from "./NotificationMenu";
import { SettingsDialog } from "./SettingsDialog";
import { UserMenu } from "./UserMenu";

type TopNavProps = {
  studentName?: string;
  moduleName?: string;
  onLogout?: () => void;
};

export function TopNav({ studentName, moduleName, onLogout }: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-none px-4 py-3 flex items-center gap-3">
        <GraduationCap className="size-6 shrink-0" />

        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0 flex-1">
          {studentName && <span className="font-medium truncate">{studentName}</span>}
          {studentName && moduleName && <span className="shrink-0">•</span>}
          {moduleName && <span className="truncate">{moduleName}</span>}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input className="pl-8 w-64 lg:w-80" placeholder="Search…" />
          </div>

          <NotificationMenu />
          <SettingsDialog />
          <UserMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
