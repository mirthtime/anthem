import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, LogOut, Save, Camera, Settings as SettingsIcon, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize scroll animations
  useScrollAnimations();

  // Update local state when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    await updateProfile({
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
    });
    setIsUpdating(false);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.warn('Sign out error:', error);
        // Don't show error toast, just continue with navigation
      }
      // Navigate to landing page regardless of any error
      window.location.href = '/';
    } catch (error) {
      console.warn('Sign out failed:', error);
      // Navigate to landing page even if sign out completely fails
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <FloatingMusicNotes />
        <div className="max-w-2xl mx-auto p-6 relative z-10">
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-12 w-48 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
              <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
            </div>
            <Card className="premium-card">
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-12 w-full bg-muted animate-pulse rounded" />
                <div className="h-24 w-full bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingMusicNotes />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-32 left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 scroll-fade-in"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-6">
            <SettingsIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Account Management</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-sunset heartbeat">Profile</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Personalize your account and manage your <span className="text-primary font-medium">musical journey</span> settings
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="scroll-scale-in"
          >
            <Card className="premium-card border-border/30 shadow-elegant">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-full bg-primary/20 border border-primary/30">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  Profile Information
                </CardTitle>
                <CardDescription className="text-base">
                  Update your display name and tell others about your musical adventures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="flex items-center justify-center mb-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-sunset flex items-center justify-center shadow-glow">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-background border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                <InputField
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted border-border/50"
                />

                <InputField
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your musical journey and favorite travel memories..."
                    className="min-h-[120px] bg-input border-border/50 focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="w-full shine-button text-lg py-6 shadow-glow"
                  size="lg"
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving Changes...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="scroll-scale-in"
          >
            <Card className="premium-card border-destructive/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-destructive text-xl">Account Actions</CardTitle>
                <CardDescription className="text-base">
                  Manage your account settings and session
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Separator className="mb-6 bg-border/50" />
                <Button 
                  variant="destructive" 
                  onClick={handleSignOut}
                  className="gap-3 text-base px-6 py-3 hover:bg-destructive/90 transition-colors"
                  size="lg"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;