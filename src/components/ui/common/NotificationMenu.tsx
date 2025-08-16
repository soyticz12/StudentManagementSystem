// =====================================
// src/components/ui/common/NotificationMenu.tsx
// =====================================
import * as React from "react";
import { Bell, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Notif = {
  id: string;
  title: string;
  description?: string;
  time: string;
  unread?: boolean;
};

export function NotificationMenu() {
  const [notifications, setNotifications] = React.useState<Notif[]>([
    {
      id: "1",
      title: "New handout posted",
      description: "Data Structures • Arrays & Lists",
      time: "2m",
      unread: true,
    },
    {
      id: "2",
      title: "Quiz reminder",
      description: "DB Systems • Quiz 2 due tonight",
      time: "1h",
      unread: true,
    },
    {
      id: "3",
      title: "Grade released",
      description: "UI/UX Intro • Flexbox Assignment",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 inline-flex items-center justify-center
                         rounded-full bg-red-500 text-white text-[10px] h-4 min-w-4 px-[4px]
                         leading-none"
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-3 py-2 flex justify-between items-center">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          <button
            className="text-xs text-primary hover:underline"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        </div>
        <DropdownMenuSeparator />

        {/* List */}
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-sm text-muted-foreground text-center">
              You’re all caught up ✨
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex items-start gap-2 py-3 px-3 cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setNotifications((prev) =>
                    prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
                  );
                }}
              >
                {/* Unread dot */}
                {n.unread ? (
                  <Circle className="size-3 mt-1 text-primary" fill="currentColor" />
                ) : (
                  <span className="size-3 mt-1 inline-block rounded-full bg-muted" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{n.title}</p>
                  {n.description && (
                    <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{n.time}</span>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <button
            className="w-full text-sm text-primary hover:underline text-left"
            onClick={() => {
              // TODO: navigate to a notifications page
            }}
          >
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
