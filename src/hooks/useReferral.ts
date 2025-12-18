import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface ReferralStats {
  referralCode: string;
  totalReferred: number;
  pendingReferrals: number;
  creditsEarned: number;
}

export interface Referral {
  id: string;
  referral_code: string;
  referred_user_id: string | null;
  status: 'pending' | 'signed_up' | 'converted' | 'credited';
  referrer_credited: boolean;
  created_at: string;
  converted_at: string | null;
}

const REFERRAL_BONUS_CREDITS = 1; // Credits given to referrer when friend signs up
const REFERRED_BONUS_CREDITS = 1; // Extra credits given to referred user (on top of welcome bonus)

export const useReferral = () => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Get or create referral code for current user
  const fetchReferralCode = async () => {
    if (!user) return;

    try {
      // Call the database function to get or create referral code
      const { data, error } = await supabase.rpc('get_or_create_referral_code', {
        user_id: user.id
      });

      if (error) throw error;
      setReferralCode(data);
    } catch (error) {
      console.error('Error fetching referral code:', error);
    }
  };

  // Fetch all referrals for current user
  const fetchReferrals = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);

      // Calculate stats
      const credited = data?.filter((r: Referral) => r.referrer_credited) || [];
      const pending = data?.filter((r: Referral) => r.status === 'signed_up' && !r.referrer_credited) || [];

      setStats({
        referralCode: referralCode || '',
        totalReferred: credited.length,
        pendingReferrals: pending.length,
        creditsEarned: credited.length * REFERRAL_BONUS_CREDITS
      });
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  // Generate referral link
  const getReferralLink = () => {
    if (!referralCode) return '';
    return `${window.location.origin}/auth?ref=${referralCode}`;
  };

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    const link = getReferralLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied! 🎉",
        description: "Share it with friends to earn free credits!",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Share referral on Twitter
  const shareOnTwitter = () => {
    const link = getReferralLink();
    if (!link) return;

    const text = encodeURIComponent(
      `I've been turning my memories into personalized songs with Anthem!\n\nUse my link to get a FREE anthem: ${link}\n\n#Anthem #memories`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // Apply referral code for new user (called during signup)
  const applyReferralCode = async (code: string, newUserId: string) => {
    if (!code || !newUserId) return false;

    try {
      // Find the referral record with this code
      const { data: referralData, error: findError } = await (supabase as any)
        .from('referrals')
        .select('*')
        .eq('referral_code', code.toUpperCase())
        .is('referred_user_id', null)
        .single();

      if (findError || !referralData) {
        console.log('Referral code not found or already used');
        return false;
      }

      // Don't allow self-referral
      if (referralData.referrer_id === newUserId) {
        console.log('Cannot use own referral code');
        return false;
      }

      // Update the referral record
      const { error: updateError } = await (supabase as any)
        .from('referrals')
        .update({
          referred_user_id: newUserId,
          status: 'signed_up',
          converted_at: new Date().toISOString()
        })
        .eq('id', referralData.id);

      if (updateError) throw updateError;

      // Credit the referrer
      await creditReferrer(referralData.referrer_id, referralData.id);

      // Credit the referred user extra bonus
      await creditReferredUser(newUserId);

      return true;
    } catch (error) {
      console.error('Error applying referral code:', error);
      return false;
    }
  };

  // Give credits to referrer
  const creditReferrer = async (referrerId: string, referralId: string) => {
    try {
      // Get current balance and increment
      const { data: currentBalance } = await (supabase as any)
        .from('user_credits')
        .select('available_credits, total_purchased')
        .eq('user_id', referrerId)
        .single();

      if (currentBalance) {
        await (supabase as any)
          .from('user_credits')
          .update({
            available_credits: currentBalance.available_credits + REFERRAL_BONUS_CREDITS,
            total_purchased: currentBalance.total_purchased + REFERRAL_BONUS_CREDITS
          })
          .eq('user_id', referrerId);

        // Log the transaction
        await (supabase as any)
          .from('credit_transactions')
          .insert({
            user_id: referrerId,
            amount: REFERRAL_BONUS_CREDITS,
            type: 'purchase',
            description: '🎁 Referral bonus - A friend signed up!'
          });

        // Mark referral as credited
        await (supabase as any)
          .from('referrals')
          .update({
            referrer_credited: true,
            status: 'credited'
          })
          .eq('id', referralId);
      }
    } catch (error) {
      console.error('Error crediting referrer:', error);
    }
  };

  // Give extra credits to referred user
  const creditReferredUser = async (userId: string) => {
    try {
      // Get current balance
      const { data: currentBalance } = await (supabase as any)
        .from('user_credits')
        .select('available_credits, total_purchased')
        .eq('user_id', userId)
        .single();

      if (currentBalance) {
        // Add extra referral bonus
        await (supabase as any)
          .from('user_credits')
          .update({
            available_credits: currentBalance.available_credits + REFERRED_BONUS_CREDITS,
            total_purchased: currentBalance.total_purchased + REFERRED_BONUS_CREDITS
          })
          .eq('user_id', userId);

        // Log the transaction
        await (supabase as any)
          .from('credit_transactions')
          .insert({
            user_id: userId,
            amount: REFERRED_BONUS_CREDITS,
            type: 'purchase',
            description: '🎁 Referral bonus - Thanks for using a friend\'s link!'
          });
      }
    } catch (error) {
      console.error('Error crediting referred user:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchReferralCode().then(() => {
        fetchReferrals().finally(() => setLoading(false));
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  // Refetch referrals when code changes
  useEffect(() => {
    if (referralCode && user) {
      fetchReferrals();
    }
  }, [referralCode]);

  return {
    referralCode,
    referrals,
    stats,
    loading,
    getReferralLink,
    copyReferralLink,
    shareOnTwitter,
    applyReferralCode,
    refreshReferrals: fetchReferrals
  };
};
