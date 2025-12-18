
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface CreditBalance {
  id: string;
  user_id: string;
  available_credits: number;
  total_purchased: number;
  total_used: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'usage';
  description: string;
  stripe_session_id?: string;
  created_at: string;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!user) return;
    
    try {
      // Use any type to bypass TypeScript restrictions until types are updated
      const { data, error } = await (supabase as any)
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setBalance(data);
      } else {
        // Create initial balance record with 1 FREE welcome credit!
        const WELCOME_CREDITS = 1;

        const { data: newBalance, error: createError } = await (supabase as any)
          .from('user_credits')
          .insert([{
            user_id: user.id,
            available_credits: WELCOME_CREDITS,
            total_purchased: WELCOME_CREDITS, // Count as "purchased" for tracking
            total_used: 0
          }])
          .select()
          .single();

        if (createError) throw createError;

        // Log the welcome bonus transaction
        await (supabase as any)
          .from('credit_transactions')
          .insert([{
            user_id: user.id,
            amount: WELCOME_CREDITS,
            type: 'purchase',
            description: '🎁 Welcome bonus - Your first song is on us!'
          }]);

        setBalance(newBalance);

        // Show welcome toast
        toast({
          title: "Welcome to Anthem!",
          description: "You've got 1 FREE credit to create your first anthem.",
        });
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const purchaseCredits = async (packageType: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Starting credit purchase for package:', packageType);
      
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { packageType, mode: 'embedded' }
      });

      if (error) {
        console.error('Purchase credits error:', error);
        throw error;
      }
      
      console.log('Purchase credits response:', data);
      
      // Handle different response scenarios
      if (data?.error) {
        throw new Error(data.error);
      }
      
      // For embedded mode, we return the clientSecret to be handled by the modal
      if (data?.clientSecret) {
        return data.clientSecret;
      } else if (data?.url) {
        // Fallback to redirect mode if embedded isn't supported
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to Checkout",
          description: "Opening Stripe checkout in a new tab...",
        });
      } else {
        throw new Error('No checkout session received');
      }
    } catch (error: any) {
      console.error('Error purchasing credits:', error);
      throw error;
    }
  };

  const consumeCredits = async (amount: number, description: string) => {
    if (!user || !balance) throw new Error('User not authenticated or balance not loaded');
    if (balance.available_credits < amount) throw new Error('Insufficient credits');

    try {
      const { error } = await supabase.functions.invoke('consume-credits', {
        body: { amount, description }
      });

      if (error) throw error;
      
      // Refresh balance after consumption
      await fetchBalance();
      
      toast({
        title: "Credits Used",
        description: `${amount} credit${amount > 1 ? 's' : ''} used for ${description}`,
      });
    } catch (error) {
      console.error('Error consuming credits:', error);
      throw error;
    }
  };

  // Auto-refresh balance when returning from Stripe checkout
  const handlePurchaseSuccess = async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
    toast({
      title: "Purchase Successful!",
      description: "Your credits have been added to your account.",
    });
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchBalance(), fetchTransactions()]).finally(() => {
        setLoading(false);
      });

      // Subscribe to real-time changes on user_credits table
      const channel = supabase
        .channel('user_credits_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_credits',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Credits updated:', payload);
            if (payload.new) {
              setBalance(payload.new as CreditBalance);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [user]);

  // Check for purchase success on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('purchase') === 'success') {
      handlePurchaseSuccess();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return {
    balance,
    transactions,
    loading,
    purchaseCredits,
    consumeCredits,
    refreshBalance: fetchBalance,
    refreshTransactions: fetchTransactions,
    handlePurchaseSuccess
  };
};
