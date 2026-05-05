UPDATE public.videos
SET source_type = 'direct',
    video_url = 'https://res.cloudinary.com/dltrwdadi/video/upload/v1777896270/The%20Bride.mp4',
    hover_video_url = 'https://res.cloudinary.com/dltrwdadi/video/upload/v1777896270/The%20Bride.mp4'
WHERE title ILIKE 'The Bride';