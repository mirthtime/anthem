
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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<any>(null);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 3,
      price: '$5.99',
      description: 'Perfect for a weekend getaway',
      popular: false,
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      credits: 5,
      price: '$9.99',
      description: 'Great for most road trips',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      credits: 10,
      price: '$19.99',
      description: 'Full soundtrack experience',
      popular: false,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      loadStripe().then((stripe) => {
        stripeRef.current = stripe;
        console.log('Stripe initialized successfully:', !!stripe);
      }).catch((error) => {
        console.error('Failed to initialize Stripe:', error);
        toast({
          title: "Payment System Error",
          description: error.message,
          variant: "destructive",
        });
      });
    }
  }, [isOpen]);

  const handlePurchase = async (packageType: string) => {
    if (!stripeRef.current) {
      toast({
        title: "Loading Payment System",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(packageType);
    setCheckoutLoading(true);
    
    try {
      console.log('Starting purchase for package:', packageType);
      
      // Get current session to ensure we're authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Please log in to purchase credits');
      }
      
      console.log('User authenticated, calling purchase-credits function...');
      
      // Use Supabase function with proper error handling
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { 
          packageType,
          mode: 'embedded'
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

      if (data?.clientSecret) {
        console.log('Received client secret, initializing embedded checkout...');
        setShowCheckout(true);
        
        // Initialize embedded checkout with proper error handling
        try {
          console.log('Attempting to initialize embedded checkout with client secret:', data.clientSecret);
          console.log('Current domain:', window.location.hostname);
          
          const checkout = await stripeRef.current.initEmbeddedCheckout({
            clientSecret: data.clientSecret,
          });

          console.log('Checkout object created successfully');

          if (checkoutRef.current) {
            checkout.mount(checkoutRef.current);
            console.log('Checkout mounted successfully');
          }
        } catch (stripeError) {
          console.error('Stripe embedded checkout error:', stripeError);
          
          // Check for domain-related errors
          if (stripeError.message?.includes('domain') || stripeError.message?.includes('origin')) {
            toast({
              title: "Domain Configuration Required",
              description: "Please add your domain to Stripe's embedded checkout allowlist.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Using Standard Checkout",
              description: "Opening secure checkout in new tab...",
            });
          }
          
          // Always fall back to redirect checkout
          const { data: redirectData, error: redirectError } = await supabase.functions.invoke('purchase-credits', {
            body: { 
              packageType,
              mode: 'payment'
            }
          });
          
          if (redirectError || redirectData?.error) {
            throw new Error('Failed to initialize payment');
          }
          
          if (redirectData?.url) {
            window.open(redirectData.url, '_blank');
            onClose();
            return;
          }
        }
      } else {
        throw new Error('No client secret received from server');
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
      setCheckoutLoading(false);
    }
  };

  const handleClose = () => {
    setShowCheckout(false);
    setLoading(null);
    setCheckoutLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {showCheckout ? "Complete Your Purchase" : "Choose Your Credit Package"}
          </DialogTitle>
          <DialogDescription>
            {showCheckout 
              ? "Secure payment powered by Stripe with Apple Pay support on mobile"
              : "Credits are used to generate AI songs for your road trip memories. Each credit = 1 song."
            }
          </DialogDescription>
        </DialogHeader>

        {checkoutLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Setting up secure payment...</p>
            </div>
          </div>
        )}

        {showCheckout && !checkoutLoading && (
          <div className="space-y-4">
            <div 
              ref={checkoutRef} 
              className="min-h-[500px] border border-border rounded-lg"
            />
            <div className="text-center text-sm text-muted-foreground">
              <p>✓ Secure payment powered by Stripe</p>
              <p>✓ Apple Pay available on mobile devices</p>
              <p>✓ No subscription required • One-time purchase</p>
            </div>
          </div>
        )}

        {!showCheckout && !checkoutLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <Card className={`h-full transition-all hover:shadow-lg ${
                    pkg.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                        <div className="text-sm text-muted-foreground">{pkg.credits} credits</div>
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
                        className={`w-full gap-2 ${pkg.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                        variant={pkg.popular ? 'default' : 'outline'}
                      >
                        <CreditCard className="h-4 w-4" />
                        {loading === pkg.id ? 'Processing...' : 'Purchase'}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
