-- Add email column to profiles table for webhook processing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the profile with the current user's email
UPDATE public.profiles 
SET email = 'tony@freedomology.com' 
WHERE user_id = 'b7bff071-e87f-4b7d-9fb4-63db2591145a';

-- Manually add the test purchase credits
UPDATE public.user_credits 
SET 
  available_credits = available_credits + 5,
  total_purchased = total_purchased + 5,
  updated_at = now()
WHERE user_id = 'b7bff071-e87f-4b7d-9fb4-63db2591145a';

-- Add the transaction record for the test purchase
INSERT INTO public.credit_transactions (
  user_id,
  type,
  amount,
  description,
  stripe_session_id
) VALUES (
  'b7bff071-e87f-4b7d-9fb4-63db2591145a',
  'purchase',
  5,
  'Manual credit addition for test purchase',
  'test_session_' || extract(epoch from now())::text
);