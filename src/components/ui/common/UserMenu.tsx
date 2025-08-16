import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  profilePath?: string;
  onLogout?: () => void;
};

export function UserMenu({ profilePath = "/profile", onLogout }: UserMenuProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored auth/session (token, role, etc.)
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");

    // Call parent handler if provided
    onLogout?.();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open profile menu">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-44">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={profilePath} aria-label="Show Profile">
            Show Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} aria-label="Logout">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
