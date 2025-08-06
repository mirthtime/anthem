
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check } from 'lucide-react';
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

export const CreditPurchaseModal = ({ isOpen, onClose }: CreditPurchaseModalProps) => {
  const { purchaseCredits } = useCredits();
  const [loading, setLoading] = useState<string | null>(null);

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

  const handlePurchase = async (packageType: string) => {
    setLoading(packageType);
    try {
      await purchaseCredits(packageType);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: "Purchase Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full ${pkg.popular ? 'border-primary shadow-lg' : 'border-border'}`}>
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
          <p>Secure payment powered by Stripe • No subscription required</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
