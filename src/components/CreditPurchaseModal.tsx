
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

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Load Stripe.js
const loadStripe = async () => {
  if (window.Stripe) return window.Stripe;
  
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => resolve(window.Stripe);
    document.head.appendChild(script);
  });
};

export const CreditPurchaseModal = ({ isOpen, onClose }: CreditPurchaseModalProps) => {
  const { purchaseCredits } = useCredits();
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
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({ 
          packageType,
          mode: 'embedded' // Request embedded mode
        }),
      });

      const { clientSecret, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }

      if (clientSecret) {
        setShowCheckout(true);
        
        // Initialize embedded checkout
        const checkout = await stripeRef.current.initEmbeddedCheckout({
          clientSecret,
        });

        if (checkoutRef.current) {
          checkout.mount(checkoutRef.current);
        }
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      if (error.message?.includes('Stripe not configured')) {
        toast({
          title: "Payment Setup Required",
          description: "Payment processing is being set up. Please try again later.",
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
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {showCheckout ? "Complete Your Purchase" : "Choose Your Credit Package"}
              </DialogTitle>
              <DialogDescription>
                {showCheckout 
                  ? "Secure payment powered by Stripe with Apple Pay support on mobile"
                  : "Credits are used to generate AI songs for your road trip memories. Each credit = 1 song."
                }
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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
