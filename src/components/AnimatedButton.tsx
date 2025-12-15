import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all duration-300',
          variants[variant],
          className
        )}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        {/* Hover shine effect */}
        <motion.div
          className="absolute inset-0 -top-2 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', skewX: '-20deg' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Button content */}
        <span className="relative z-10">{children}</span>

        {/* Ripple effect on click */}
        <motion.span
          className="absolute inset-0 z-0"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
          }}
        />
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';