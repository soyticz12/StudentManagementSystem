// =====================================
// src/Pages/Login.tsx
// =====================================
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, UserSquare2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Role = "student" | "professor";

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<Role>("student");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);

    if (role === "student") {
      navigate("/");
    } else {
      navigate("/professor");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      {/* Top Bar */}
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-3 flex items-center gap-2">
          <GraduationCap className="size-6" />
          <span className="font-semibold">Campus Portal</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Choose your role and enter your credentials.
            </p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="size-4" /> Student
              </TabsTrigger>
              <TabsTrigger value="professor" className="flex items-center gap-2">
                <UserSquare2 className="size-4" /> Professor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-6">
              <AuthForm
                email={email}
                password={password}
                showPw={showPw}
                error={error}
                loading={loading}
                onEmail={setEmail}
                onPassword={setPassword}
                onTogglePw={() => setShowPw((s) => !s)}
                onSubmit={onSubmit}
                submitLabel="Login as Student"
              />
            </TabsContent>

            <TabsContent value="professor" className="mt-6">
              <AuthForm
                email={email}
                password={password}
                showPw={showPw}
                error={error}
                loading={loading}
                onEmail={setEmail}
                onPassword={setPassword}
                onTogglePw={() => setShowPw((s) => !s)}
                onSubmit={onSubmit}
                submitLabel="Login as Professor"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Campus Portal. All rights reserved.
      </footer>
    </div>
  );
}

function AuthForm(props: {
  email: string;
  password: string;
  showPw: boolean;
  error: string | null;
  loading: boolean;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onTogglePw: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}) {
  const {
    email,
    password,
    showPw,
    error,
    loading,
    onEmail,
    onPassword,
    onTogglePw,
    onSubmit,
    submitLabel,
  } = props;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@school.edu.ph"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPassword(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={onTogglePw}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
