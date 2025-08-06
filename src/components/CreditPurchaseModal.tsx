
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCredits } from '@/hooks/useCredits';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Load Stripe.js
const loadStripe = async (): Promise<any> => {
  // You need to replace this with your actual Stripe publishable key
  // Get it from: https://dashboard.stripe.com/apikeys
  const publishableKey = 'pk_live_51QxqKlKLhNTZopXG8x8b4EWTOz9CqAYLJr9qCKOg60MBUoDGZas5GpcgTytw0J9SgBVlOBDqenOeZK6TmPEgz46100mRPrQuYh';

  if (typeof window !== 'undefined' && (window as any).Stripe) {
    return (window as any).Stripe(publishableKey);
  }
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => {
      if ((window as any).Stripe) {
        const stripe = (window as any).Stripe(publishableKey);
        resolve(stripe);
      } else {
        reject(new Error('Failed to load Stripe'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Stripe script'));
    document.head.appendChild(script);
  });
};

export const CreditPurchaseModal = ({ isOpen, onClose }: CreditPurchaseModalProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 3,
      price: '$7.99',
      description: 'Perfect for a quick trip',
      popular: false,
      perCredit: '$2.66',
      savings: null,
    },
    {
      id: 'popular',
      name: 'Road Warrior',
      credits: 8,
      price: '$14.99',
      description: 'Best value for most trips',
      popular: true,
      perCredit: '$1.87',
      savings: 'Save 30%',
    },
    {
      id: 'premium',
      name: 'Ultimate Pack',
      credits: 20,
      price: '$29.99',
      description: 'Maximum savings & flexibility',
      popular: false,
      perCredit: '$1.50',
      savings: 'Save 44%',
    },
  ];

  const handlePurchase = async (packageType: string) => {
    setLoading(packageType);
    
    try {
      console.log('Starting purchase for package:', packageType);
      
      // Get current session to ensure we're authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Please log in to purchase credits');
      }
      
      console.log('User authenticated, calling purchase-credits function...');
      
      // Use Supabase function to create checkout session
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { 
          packageType,
          mode: 'payment'
        }
      });

      console.log('Purchase credits response:', { data, error });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      if (data?.error) {
        console.error('Server error:', data.error);
        throw new Error(data.error);
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Checkout",
          description: "Opening secure payment in a new tab...",
        });
        onClose();
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      if (error.message?.includes('Stripe not configured')) {
        toast({
          title: "Payment Setup Required",
          description: "Payment processing is being set up. Please try again later.",
          variant: "destructive",
        });
      } else if (error.message?.includes('log in')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to purchase credits.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Purchase Failed",
          description: error.message || "Unable to process payment. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(null);
    }
  };

  const handleClose = () => {
    setLoading(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choose Your Credit Package</DialogTitle>
          <DialogDescription>
            Credits are used to generate AI songs for your road trip memories. Each credit = 1 song.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                   {pkg.popular && (
                     <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                       <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                         🔥 Most Popular
                       </span>
                     </div>
                   )}
                  
                   <Card className={`h-full transition-all duration-500 hover:shadow-elegant group ${
                     pkg.popular ? 'border-primary shadow-glow scale-105 bg-gradient-to-br from-primary/5 to-primary/10 ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
                   }`}>
                     <CardHeader className="text-center pb-4">
                       <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{pkg.name}</CardTitle>
                       <div className="space-y-2">
                         <div className="flex items-center justify-center gap-2">
                           <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{pkg.price}</div>
                           {pkg.savings && (
                             <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                               {pkg.savings}
                             </div>
                           )}
                         </div>
                         <div className="text-sm text-muted-foreground">{pkg.credits} credits</div>
                         <div className="text-xs text-primary/70 font-medium">{pkg.perCredit} per credit</div>
                       </div>
                     </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground text-center">
                        {pkg.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{pkg.credits} AI-generated songs</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>3-minute tracks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>High-quality audio</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Custom artwork</span>
                        </div>
                      </div>
                      
                       <Button
                         onClick={() => handlePurchase(pkg.id)}
                         disabled={loading === pkg.id}
                         className={`w-full gap-2 font-semibold ${
                           pkg.popular 
                             ? 'premium-button text-white shadow-glow hover:shadow-intense' 
                             : 'hover:shadow-md'
                         }`}
                         variant={pkg.popular ? 'premium' : 'outline'}
                       >
                         <CreditCard className="h-4 w-4" />
                         {loading === pkg.id ? (
                           <>
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             Processing...
                           </>
                         ) : (
                           'Purchase'
                         )}
                       </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

        <div className="text-center text-sm text-muted-foreground mt-6 pt-4 border-t border-border">
          <p>✓ Secure payment powered by Stripe</p>
          <p>✓ Apple Pay available on mobile devices</p>
          <p>✓ No subscription required • One-time purchase</p>
          <p>✓ Credits never expire</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
