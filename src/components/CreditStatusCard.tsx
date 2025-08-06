
import { motion } from 'framer-motion';
import { CreditCard, Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCredits } from '@/hooks/useCredits';
import { useState } from 'react';
import { CreditPurchaseModal } from './CreditPurchaseModal';

export const CreditStatusCard = () => {
  const { balance, loading } = useCredits();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  if (loading) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-muted rounded w-16"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
      >
        <Card className="bg-gradient-card border-border hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Credits
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <History className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">
                {balance?.available_credits || 0}
              </span>
              <span className="text-sm text-muted-foreground mb-1">available</span>
            </div>
            
            {balance?.available_credits === 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You're out of credits! Purchase more to continue generating songs.
                </p>
                <Button 
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Buy Credits
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Total used: {balance?.total_used || 0}</span>
                  <span>Total purchased: {balance?.total_purchased || 0}</span>
                </div>
                <Button 
                  onClick={() => setShowPurchaseModal(true)}
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Buy More
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <CreditPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </>
  );
};
