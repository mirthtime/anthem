import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="w-full max-w-md text-center bg-gradient-card border-border shadow-card">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-primary/10 border border-primary/20">
              <Icon className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {title}
          </h3>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
          
          <Button 
            onClick={onAction}
            size="lg"
            className="w-full"
          >
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};