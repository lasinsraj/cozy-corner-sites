-- Create table for storing device tokens for push notifications
CREATE TABLE public.device_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  device_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert tokens (from mobile app)
CREATE POLICY "Anyone can insert device tokens"
ON public.device_tokens
FOR INSERT
WITH CHECK (true);

-- Allow reading tokens for sending notifications (edge function uses service role)
CREATE POLICY "Anyone can view device tokens"
ON public.device_tokens
FOR SELECT
USING (true);

-- Allow updating tokens
CREATE POLICY "Anyone can update device tokens"
ON public.device_tokens
FOR UPDATE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_device_tokens_updated_at
BEFORE UPDATE ON public.device_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();