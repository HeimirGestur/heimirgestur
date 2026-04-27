import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    const authCall =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email: cleanEmail, password })
        : supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });

    const { error } = await authCall;
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (mode === "signup") {
      toast.success("Check your email to confirm your account.");
      setMode("signin");
      return;
    }

    toast.success("Signed in.");
    navigate("/admin", { replace: true });
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin`,
    });
    setIsSubmitting(false);

    if (result.error) toast.error(result.error.message);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link to="/" className="mb-14 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground">
          HeimirGestur
        </Link>

        <section className="border border-border bg-card p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="font-sans text-2xl font-medium text-foreground">CMS Login</h1>
            <p className="mt-2 font-sans text-sm text-muted-foreground">Manage portfolio videos, pages, and contact details.</p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} className="pr-11" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={isSubmitting}>
            Continue with Google
          </Button>

          <button type="button" onClick={() => setMode((value) => (value === "signin" ? "signup" : "signin"))} className="mt-6 w-full text-center font-sans text-sm text-muted-foreground transition-colors hover:text-foreground">
            {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
        </section>
      </div>
    </main>
  );
};

export default Login;
