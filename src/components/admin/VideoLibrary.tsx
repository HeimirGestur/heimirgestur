import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { type CmsVideo, type VideoCategory, type VideoSourceType, vimeoThumbnail } from "@/hooks/usePortfolioContent";

const emptyForm = (category: VideoCategory, sortOrder: number): Partial<CmsVideo> => ({
  title: "",
  subtitle: "",
  director: "",
  production: "",
  year: "",
  category,
  source_type: "hls",
  video_url: "",
  hover_video_url: "",
  thumbnail_url: "",
  vimeo_id: "",
  sort_order: sortOrder,
  is_visible: true,
});

export const VideoLibrary = ({ category }: { category: VideoCategory }) => {
  const queryClient = useQueryClient();
  const [editingVideo, setEditingVideo] = useState<Partial<CmsVideo> | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["admin-videos", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos" as never)
        .select("*" as never)
        .eq("category", category)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as unknown as CmsVideo[];
    },
  });

  const nextSortOrder = useMemo(() => (videos.length ? Math.max(...videos.map((video) => video.sort_order)) + 1 : 0), [videos]);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-videos", category] });
    void queryClient.invalidateQueries({ queryKey: ["portfolio-videos", category] });
  };

  const saveMutation = useMutation({
    mutationFn: async (form: Partial<CmsVideo>) => {
      const payload = {
        title: form.title?.trim() || "Untitled",
        subtitle: form.subtitle || null,
        director: form.director || null,
        production: form.production || null,
        year: form.year || null,
        category,
        source_type: form.source_type || "hls",
        video_url: form.video_url || null,
        hover_video_url: form.hover_video_url || null,
        thumbnail_url: form.thumbnail_url || (form.vimeo_id ? vimeoThumbnail(form.vimeo_id) : null),
        vimeo_id: form.vimeo_id || null,
        sort_order: Number(form.sort_order ?? nextSortOrder),
        is_visible: Boolean(form.is_visible),
      };

      const request = form.id
        ? supabase.from("videos" as never).update(payload as never).eq("id", form.id)
        : supabase.from("videos" as never).insert(payload as never);

      const { error } = await request;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Video saved.");
      setEditingVideo(null);
      invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<CmsVideo> }) => {
      const { error } = await supabase.from("videos" as never).update(values as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Video removed.");
      invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const moveVideo = (index: number, direction: -1 | 1) => {
    const current = videos[index];
    const target = videos[index + direction];
    if (!current || !target) return;
    updateMutation.mutate({ id: current.id, values: { sort_order: target.sort_order } });
    updateMutation.mutate({ id: target.id, values: { sort_order: current.sort_order } });
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-sans text-xl font-medium capitalize text-foreground">{category.replace("-", " ")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Control ordering, visibility, thumbnails, and source links.</p>
        </div>
        <Button onClick={() => setEditingVideo(emptyForm(category, nextSortOrder))}>
          <Plus /> Add video
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)}
        </div>
      ) : (
        <div className="divide-y divide-border border border-border bg-card">
          {videos.map((video, index) => (
            <article key={video.id} className="grid gap-4 p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
              <div className="aspect-video overflow-hidden bg-muted">
                {video.thumbnail_url ? <img src={video.thumbnail_url} alt={video.title} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-sans text-sm font-medium text-foreground">{video.title}</h3>
                  <Badge variant="outline">{video.source_type}</Badge>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{video.director || video.production || video.year || "No metadata"}</p>
                <div className="mt-3 flex items-center gap-3">
                  <Switch checked={video.is_visible} onCheckedChange={(checked) => updateMutation.mutate({ id: video.id, values: { is_visible: checked } })} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{video.is_visible ? "Visible" : "Hidden"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <Button variant="outline" size="icon" onClick={() => moveVideo(index, -1)} disabled={index === 0}><ArrowUp /></Button>
                <Button variant="outline" size="icon" onClick={() => moveVideo(index, 1)} disabled={index === videos.length - 1}><ArrowDown /></Button>
                <Button variant="outline" size="icon" onClick={() => setEditingVideo(video)}><Pencil /></Button>
                <Button variant="outline" size="icon" onClick={() => deleteMutation.mutate(video.id)}><Trash2 /></Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={Boolean(editingVideo)} onOpenChange={(open) => !open && setEditingVideo(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle>{editingVideo?.id ? "Edit video" : "Add video"}</DialogTitle></DialogHeader>
          {editingVideo && <VideoForm form={editingVideo} setForm={setEditingVideo} onSave={() => saveMutation.mutate(editingVideo)} isSaving={saveMutation.isPending} />}
        </DialogContent>
      </Dialog>
    </section>
  );
};

const VideoForm = ({ form, setForm, onSave, isSaving }: { form: Partial<CmsVideo>; setForm: (form: Partial<CmsVideo>) => void; onSave: () => void; isSaving: boolean }) => {
  const setValue = (key: keyof CmsVideo, value: string | number | boolean) => setForm({ ...form, [key]: value });

  return (
    <form onSubmit={(event) => { event.preventDefault(); onSave(); }} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" value={form.title || ""} onChange={(value) => setValue("title", value)} required />
        <Field label="Subtitle" value={form.subtitle || ""} onChange={(value) => setValue("subtitle", value)} />
        <Field label="Director" value={form.director || ""} onChange={(value) => setValue("director", value)} />
        <Field label="Production" value={form.production || ""} onChange={(value) => setValue("production", value)} />
        <Field label="Year" value={form.year || ""} onChange={(value) => setValue("year", value)} />
        <Field label="Sort order" type="number" value={String(form.sort_order ?? 0)} onChange={(value) => setValue("sort_order", Number(value))} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Source type</Label>
          <Select value={form.source_type || "hls"} onValueChange={(value) => setValue("source_type", value as VideoSourceType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vimeo">Vimeo</SelectItem>
              <SelectItem value="cloudinary">Cloudinary MP4</SelectItem>
              <SelectItem value="hls">HLS</SelectItem>
              <SelectItem value="direct">Direct MP4</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field label="Vimeo ID" value={form.vimeo_id || ""} onChange={(value) => setValue("vimeo_id", value)} />
      </div>

      <Field label="Video URL" value={form.video_url || ""} onChange={(value) => setValue("video_url", value)} />
      <Field label="Thumbnail URL" value={form.thumbnail_url || ""} onChange={(value) => setValue("thumbnail_url", value)} />
      <Field label="Hover video URL" value={form.hover_video_url || ""} onChange={(value) => setValue("hover_video_url", value)} />

      <div className="flex items-center justify-between border border-border p-4">
        <div><Label>Visible on site</Label><p className="mt-1 text-sm text-muted-foreground">Hidden videos remain available in the CMS.</p></div>
        <Switch checked={Boolean(form.is_visible)} onCheckedChange={(checked) => setValue("is_visible", checked)} />
      </div>

      <Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="animate-spin" />} Save video</Button>
    </form>
  );
};

const Field = ({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
  </div>
);
