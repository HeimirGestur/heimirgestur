import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAboutMe } from "@/hooks/usePortfolioContent";

export const AboutMeEditor = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useAboutMe();
  const [bio, setBio] = useState("");

  useEffect(() => setBio(data?.bio || ""), [data?.bio]);

  const mutation = useMutation({
    mutationFn: async () => {
      const request = data?.id
        ? supabase.from("about_me" as never).update({ bio } as never).eq("id", data.id)
        : supabase.from("about_me" as never).insert({ bio } as never);
      const { error } = await request;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("About page saved.");
      void queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-sans text-xl font-medium text-foreground">About</h2>
        <p className="mt-1 text-sm text-muted-foreground">Edit the biography text shown on the site.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} className="min-h-[420px] resize-y leading-7" />
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="animate-spin" />} Save changes
      </Button>
    </section>
  );
};
