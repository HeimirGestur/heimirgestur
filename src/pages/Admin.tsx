import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clapperboard, Contact, Film, Home, LogOut, Star, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AboutMeEditor } from "@/components/admin/AboutMeEditor";
import { ContactPageEditor } from "@/components/admin/ContactPageEditor";
import { VideoLibrary } from "@/components/admin/VideoLibrary";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { VideoCategory } from "@/hooks/usePortfolioContent";

const tabs = [
  { id: "selected", label: "Selected", icon: Star },
  { id: "films", label: "Films", icon: Film },
  { id: "commercials", label: "Commercials", icon: Clapperboard },
  { id: "about", label: "About", icon: UserRound },
  { id: "contact", label: "Contact", icon: Contact },
] as const;

type AdminTab = (typeof tabs)[number]["id"];

const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("selected");
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
    navigate("/login", { replace: true });
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">HeimirGestur</p>
              <h1 className="mt-1 font-sans text-xl font-medium">Content Management System</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild><Link to="/"><Home /> Open Site ↗</Link></Button>
              <Button variant="outline" onClick={logout}><LogOut /> Logout</Button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[220px_1fr] md:px-8">
          <nav className="md:sticky md:top-28 md:self-start">
            <div className="grid gap-1 border border-border bg-card p-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-3 text-left font-sans text-sm transition-colors ${activeTab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </nav>

          <section className="border border-border bg-card p-4 shadow-sm md:p-8">
            {activeTab === "about" ? <AboutMeEditor /> : activeTab === "contact" ? <ContactPageEditor /> : <VideoLibrary category={activeTab as VideoCategory} />}
          </section>
        </div>
      </main>
    </AdminGuard>
  );
};

export default Admin;
