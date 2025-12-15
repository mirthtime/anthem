-- Remove hardcoded test data from previous migration
-- This migration removes any test data that was manually inserted

-- Remove test credits and transactions for the hardcoded user
DELETE FROM public.credit_transactions 
WHERE user_id = 'b7bff071-e87f-4b7d-9fb4-63db2591145a' 
  AND description = 'Manual credit addition for test purchase';

-- Reset the email for the hardcoded user profile (if exists)
UPDATE public.profiles 
SET email = NULL 
WHERE user_id = 'b7bff071-e87f-4b7d-9fb4-63db2591145a' 
  AND email = 'tony@freedomology.com';

-- Note: This is a cleanup migration to ensure no test data remains in production