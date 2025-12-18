import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useReferral } from '@/hooks/useReferral';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Disc3, Heart, Sparkles, Gift } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const { applyReferralCode } = useReferral();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Initialize scroll animations
  useScrollAnimations();

  // Extract referral code from URL on mount
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode.toUpperCase());
      setIsSignUp(true); // Auto-switch to signup mode for referrals
      toast({
        title: "🎁 Referral Bonus!",
        description: "Sign up now to get an extra FREE credit from your friend!",
      });
    }
  }, [searchParams]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password);

        if (error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // If there's a referral code and we have a new user, apply it
          if (referralCode && data?.user?.id) {
            const applied = await applyReferralCode(referralCode, data.user.id);
            if (applied) {
              toast({
                title: "Welcome to Anthem!",
                description: "Account created! You got a bonus credit from your friend's referral.",
              });
            } else {
              toast({
                title: "Account Created",
                description: "Please check your email to confirm your account.",
              });
            }
          } else {
            toast({
              title: "Account Created",
              description: "Please check your email to confirm your account.",
            });
          }
        }
      } else {
        const { error } = await signIn(email, password);

        if (error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingMusicNotes />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-glow/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="premium-card border-border/30 shadow-elegant backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Disc3 className="h-12 w-12 text-primary" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <CardTitle className="text-3xl lg:text-4xl font-bold mb-2 tracking-wider">
                  {isSignUp ? (
                    <>JOIN <span className="text-gradient-gold">ANTHEM</span></>
                  ) : (
                    <>WELCOME <span className="text-gradient-gold">BACK</span></>
                  )}
                </CardTitle>
                {referralCode ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm mb-4">
                    <Gift className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-medium text-green-500">Referral bonus active! +1 extra credit</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-4">
                    <Heart className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Your musical journey awaits</span>
                  </div>
                )}
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  {isSignUp
                    ? referralCode
                      ? 'Your friend shared Anthem with you! Sign up to get 2 FREE anthems - your welcome credit plus the referral bonus!'
                      : 'Create your account to start turning your memories into songs you\'ll actually listen to again'
                    : 'Sign in to continue creating anthems that lock in your best moments'
                  }
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent>
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <InputField
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                />
                <InputField
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                />
                <Button 
                  type="submit" 
                  className="w-full shine-button text-lg py-6 shadow-glow" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Magic...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </div>
                  )}
                </Button>
              </motion.form>
              
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"
                  }
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;