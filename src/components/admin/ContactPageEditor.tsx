import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useContactPage } from "@/hooks/usePortfolioContent";

const fields = [
  ["representation_title", "Representation title"], ["representation_link", "Representation link"],
  ["features_name", "Features name"], ["features_email", "Features email"],
  ["commercials_contact_1_name", "Commercial contact 1 name"], ["commercials_contact_1_email", "Commercial contact 1 email"],
  ["commercials_contact_2_name", "Commercial contact 2 name"], ["commercials_contact_2_email", "Commercial contact 2 email"],
  ["commercials_contact_3_name", "Commercial contact 3 name"], ["commercials_contact_3_email", "Commercial contact 3 email"],
  ["music_videos_name", "Music videos name"], ["music_videos_email", "Music videos email"],
  ["personal_name", "Personal name"], ["personal_email", "Personal email"],
  ["instagram_url", "Instagram URL"], ["vimeo_url", "Vimeo URL"],
] as const;

type ContactForm = Record<(typeof fields)[number][0], string>;

const blankForm = fields.reduce((acc, [key]) => ({ ...acc, [key]: "" }), {} as ContactForm);

export const ContactPageEditor = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useContactPage();
  const [form, setForm] = useState<ContactForm>(blankForm);

  useEffect(() => {
    setForm(fields.reduce((acc, [key]) => ({ ...acc, [key]: String(data?.[key] || "") }), {} as ContactForm));
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      const request = data?.id
        ? supabase.from("contact_page" as never).update(form as never).eq("id", data.id)
        : supabase.from("contact_page" as never).insert(form as never);
      const { error } = await request;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contact page saved.");
      void queryClient.invalidateQueries({ queryKey: ["contact-page"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const setValue = (key: keyof ContactForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-sans text-xl font-medium text-foreground">Contact</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage representation, contact groups, and social links.</p>
      </div>
      <EditorSection title="Representation"><Field form={form} setValue={setValue} field="representation_title" label="Title" /><Field form={form} setValue={setValue} field="representation_link" label="Link" /></EditorSection>
      <EditorSection title="Features"><Field form={form} setValue={setValue} field="features_name" label="Name" /><Field form={form} setValue={setValue} field="features_email" label="Email" /></EditorSection>
      <EditorSection title="Commercials"><Field form={form} setValue={setValue} field="commercials_contact_1_name" label="Contact 1 name" /><Field form={form} setValue={setValue} field="commercials_contact_1_email" label="Contact 1 email" /><Field form={form} setValue={setValue} field="commercials_contact_2_name" label="Contact 2 name" /><Field form={form} setValue={setValue} field="commercials_contact_2_email" label="Contact 2 email" /><Field form={form} setValue={setValue} field="commercials_contact_3_name" label="Contact 3 name" /><Field form={form} setValue={setValue} field="commercials_contact_3_email" label="Contact 3 email" /></EditorSection>
      <EditorSection title="Music Videos"><Field form={form} setValue={setValue} field="music_videos_name" label="Name" /><Field form={form} setValue={setValue} field="music_videos_email" label="Email" /></EditorSection>
      <EditorSection title="Personal"><Field form={form} setValue={setValue} field="personal_name" label="Name" /><Field form={form} setValue={setValue} field="personal_email" label="Email" /></EditorSection>
      <EditorSection title="Socials"><Field form={form} setValue={setValue} field="instagram_url" label="Instagram URL" /><Field form={form} setValue={setValue} field="vimeo_url" label="Vimeo URL" /></EditorSection>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="animate-spin" />} Save changes</Button>
    </section>
  );
};

const EditorSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div><h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{title}</h3><Separator className="mt-3" /></div>
    <div className="grid gap-4 md:grid-cols-2">{children}</div>
  </div>
);

const Field = ({ form, setValue, field, label }: { form: ContactForm; setValue: (key: keyof ContactForm, value: string) => void; field: keyof ContactForm; label: string }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={form[field]} onChange={(event) => setValue(field, event.target.value)} />
  </div>
);
