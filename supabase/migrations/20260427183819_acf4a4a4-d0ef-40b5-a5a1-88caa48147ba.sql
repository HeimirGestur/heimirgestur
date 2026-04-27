CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.video_category AS ENUM ('selected', 'films', 'commercials', 'music-videos');
CREATE TYPE public.video_source_type AS ENUM ('vimeo', 'cloudinary', 'direct', 'youtube', 'hls');

CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  director TEXT,
  production TEXT,
  year TEXT,
  category public.video_category NOT NULL DEFAULT 'films',
  source_type public.video_source_type NOT NULL DEFAULT 'hls',
  video_url TEXT,
  hover_video_url TEXT,
  thumbnail_url TEXT,
  vimeo_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.about_me (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_page (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  representation_title TEXT DEFAULT '',
  representation_link TEXT DEFAULT '',
  features_name TEXT DEFAULT '',
  features_email TEXT DEFAULT '',
  commercials_contact_1_name TEXT DEFAULT '',
  commercials_contact_1_email TEXT DEFAULT '',
  commercials_contact_2_name TEXT DEFAULT '',
  commercials_contact_2_email TEXT DEFAULT '',
  commercials_contact_3_name TEXT DEFAULT '',
  commercials_contact_3_email TEXT DEFAULT '',
  music_videos_name TEXT DEFAULT '',
  music_videos_email TEXT DEFAULT '',
  personal_name TEXT DEFAULT '',
  personal_email TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  vimeo_url TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_page ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_me_updated_at
BEFORE UPDATE ON public.about_me
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_page_updated_at
BEFORE UPDATE ON public.contact_page
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Visible videos are public"
ON public.videos
FOR SELECT
USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert videos"
ON public.videos
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update videos"
ON public.videos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete videos"
ON public.videos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "About content is public"
ON public.about_me
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert about content"
ON public.about_me
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update about content"
ON public.about_me
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Contact content is public"
ON public.contact_page
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert contact content"
ON public.contact_page
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact content"
ON public.contact_page
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_videos_category_sort ON public.videos (category, sort_order);
CREATE INDEX idx_videos_visible ON public.videos (is_visible);
CREATE INDEX idx_user_roles_user_role ON public.user_roles (user_id, role);

INSERT INTO public.about_me (bio)
VALUES ('I am an Icelandic cinematographer and photographer, my work is deeply rooted in the traditions of classical cinema. My visual language is shaped by education in the craft as I completed both my Bachelor''s and Master''s degrees at the National Film School in Łódź.\n\nThis foundation has instilled in me a disciplined approach to the image, particularly through my extensive work with analog film. My aesthetic is defined by technical precision and atmospheric storytelling, applying the weight of classical cinematic traditions to a modern context.\n\nMy portfolio as a Director of Photography includes award-winning short films and music videos recognized by the Reykjavík International Film Festival and the Icelandic Music Awards. This visual work is linked to my background as a musician; having performed with various bands and composed scores for brands such as ACNE and Nordiska Galleriet, I bring a rhythmic, melodic sensibility to the projects I work on.');

INSERT INTO public.contact_page (
  representation_title,
  representation_link,
  personal_name,
  personal_email,
  instagram_url,
  vimeo_url
)
VALUES (
  'Heimir Gestur Valdimarsson',
  '',
  'Heimir Gestur Valdimarsson',
  'heimirgestur@gmail.com',
  'https://www.instagram.com/heimirgestur/',
  'https://vimeo.com/user10633087'
);