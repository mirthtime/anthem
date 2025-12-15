
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StripeCheckoutModal } from '@/components/StripeCheckoutModal';

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export const CreditPurchaseModal = ({ isOpen, onClose }: CreditPurchaseModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

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

  const handlePurchase = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handleClose = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
    onClose();
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
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
                         onClick={() => handlePurchase(pkg)}
                         className={`w-full gap-2 font-semibold ${
                           pkg.popular 
                             ? 'premium-button text-white shadow-glow hover:shadow-intense' 
                             : 'hover:shadow-md'
                         }`}
                         variant={pkg.popular ? 'premium' : 'outline'}
                       >
                         <Zap className="h-4 w-4" />
                         Get Credits
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
      
      {/* Stripe Checkout Modal */}
      {selectedPackage && (
        <StripeCheckoutModal
          isOpen={showCheckout}
          onClose={handleCheckoutClose}
          packageInfo={{
            id: selectedPackage.id,
            name: selectedPackage.name,
            credits: selectedPackage.credits,
            price: selectedPackage.price,
          }}
        />
      )}
    </Dialog>
  );
};
