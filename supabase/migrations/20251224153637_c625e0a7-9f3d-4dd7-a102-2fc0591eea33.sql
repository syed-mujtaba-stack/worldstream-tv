-- Create a table for recently watched channels
CREATE TABLE public.recently_watched (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  channel_id TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_logo TEXT,
  channel_url TEXT NOT NULL,
  channel_country TEXT,
  channel_category TEXT,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, channel_id)
);

-- Enable Row Level Security
ALTER TABLE public.recently_watched ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own recently watched" 
ON public.recently_watched 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to recently watched" 
ON public.recently_watched 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their recently watched" 
ON public.recently_watched 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their recently watched" 
ON public.recently_watched 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_recently_watched_user_id ON public.recently_watched(user_id);
CREATE INDEX idx_recently_watched_watched_at ON public.recently_watched(watched_at DESC);