import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CreditCard, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51QxqKlKLhNTZopXG8x8b4EWTOz9CqAYLJr9qCKOg60MBUoDGZas5GpcgTytw0J9SgBVlOBDqenOeZK6TmPEgz46100mRPrQuYh';
const stripePromise = loadStripe(stripePublishableKey);

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageInfo: {
    id: string;
    name: string;
    credits: number;
    price: string;
  };
}

const CheckoutForm = ({ packageInfo, onSuccess, onError }: {
  packageInfo: StripeCheckoutModalProps['packageInfo'];
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/settings?purchase=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          onError(error.message || 'Payment failed');
        } else {
          onError('An unexpected error occurred.');
        }
      } else {
        // Payment succeeded
        onSuccess();
      }
    } catch (error) {
      onError('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{packageInfo.name}</span>
          <span className="text-xl font-bold text-primary">{packageInfo.price}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {packageInfo.credits} song credits
        </div>
      </div>

      <PaymentElement 
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              email: '',
            }
          },
          business: {
            name: 'TripTunes AI'
          }
        }}
      />

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full h-12 text-base font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {packageInfo.price}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Secure payment
        </div>
        <div className="flex items-center gap-1">
          <Check className="h-3 w-3" />
          Instant delivery
        </div>
      </div>
    </form>
  );
};

export const StripeCheckoutModal = ({ isOpen, onClose, packageInfo }: StripeCheckoutModalProps) => {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const createPaymentIntent = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Get the client secret from our edge function
        const { data, error } = await supabase.functions.invoke('purchase-credits', {
          body: {
            packageType: packageInfo.id,
            mode: 'embedded'
          }
        });

        if (error) throw error;

        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('Failed to create checkout session');
        }
      } catch (error: any) {
        console.error('Failed to create payment intent:', error);
        setError(error.message || 'Failed to initialize payment');
        toast({
          title: 'Error',
          description: error.message || 'Failed to initialize payment',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [isOpen, packageInfo]);

  const handleSuccess = () => {
    toast({
      title: 'Payment Successful!',
      description: `${packageInfo.credits} credits have been added to your account.`,
    });
    
    // Wait a moment for the webhook to process
    setTimeout(() => {
      window.location.href = '/settings?purchase=success';
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    toast({
      title: 'Payment Failed',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#e67e22',
      colorBackground: '#1a1612',
      colorSurface: '#25201a',
      colorText: '#f5f3f0',
      colorTextSecondary: '#a39383',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '12px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        backgroundColor: '#25201a',
        border: '1px solid #3d342b',
      },
      '.Input:focus': {
        border: '1px solid #e67e22',
        boxShadow: '0 0 0 1px #e67e22',
      },
      '.Tab': {
        border: '1px solid #3d342b',
        boxShadow: 'none',
      },
      '.Tab--selected': {
        backgroundColor: '#e67e22',
        color: '#1a1612',
        border: '1px solid #e67e22',
      },
      '.TabLabel': {
        color: '#a39383',
      },
      '.Tab--selected .TabLabel': {
        color: '#1a1612',
      },
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Complete Purchase</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Initializing secure checkout...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={onClose} variant="outline">
                    Close
                  </Button>
                </motion.div>
              ) : clientSecret ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm
                      packageInfo={packageInfo}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  </Elements>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};