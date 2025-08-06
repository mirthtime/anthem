
-- Create a trigger function to give new users 1 free credit
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert initial credit balance for new user
  INSERT INTO public.user_credits (user_id, available_credits, total_purchased, total_used)
  VALUES (NEW.id, 1, 0, 0);
  
  -- Insert transaction record for the free credit
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 1, 'purchase', 'Welcome credit - free trial');
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically give new users 1 free credit
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();
