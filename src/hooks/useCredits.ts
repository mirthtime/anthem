import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CreditBalance {
  available_credits: number;
  total_purchased: number;
  total_used: number;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'usage';
  description: string;
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
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setBalance(data);
      } else {
        // Create initial balance record
        const { data: newBalance, error: createError } = await supabase
          .from('user_credits')
          .insert([{
            user_id: user.id,
            available_credits: 0,
            total_purchased: 0,
            total_used: 0
          }])
          .select()
          .single();

        if (createError) throw createError;
        setBalance(newBalance);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
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
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { packageType }
      });

      if (error) throw error;
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
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
    } catch (error) {
      console.error('Error consuming credits:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchBalance(), fetchTransactions()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    balance,
    transactions,
    loading,
    purchaseCredits,
    consumeCredits,
    refreshBalance: fetchBalance,
    refreshTransactions: fetchTransactions
  };
};