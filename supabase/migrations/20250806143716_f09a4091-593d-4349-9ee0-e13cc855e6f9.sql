-- Create user_credits table to track credit balances
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  available_credits INTEGER NOT NULL DEFAULT 0,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  total_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit_transactions table to track credit usage and purchases
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage')),
  description TEXT NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_credits
CREATE POLICY "Users can view their own credits" 
ON public.user_credits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" 
ON public.user_credits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can insert credits" 
ON public.user_credits 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Edge functions can update any credits" 
ON public.user_credits 
FOR UPDATE 
USING (true);

-- Create policies for credit_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.credit_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can insert transactions" 
ON public.credit_transactions 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates on user_credits
CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();