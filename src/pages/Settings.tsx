import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useReferral } from '@/hooks/useReferral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, LogOut, Save, Camera, Settings as SettingsIcon, Loader2, Gift, Copy, Twitter, Users, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { referralCode, stats, copyReferralLink, shareOnTwitter, getReferralLink, loading: referralLoading } = useReferral();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize scroll animations
  useScrollAnimations();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, show a helpful message
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          throw new Error('Avatar storage is not configured. Please contact support.');
        }
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully!",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
                    <div className="w-24 h-24 rounded-full bg-gradient-sunset flex items-center justify-center shadow-glow overflow-hidden">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-white" />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAvatarClick}
                      disabled={isUploadingAvatar}
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-background border-border/50 hover:border-primary/50 transition-colors"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
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

          {/* Referral Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="scroll-scale-in"
          >
            <Card className="premium-card border-primary/20 shadow-elegant overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-6 relative">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-full bg-primary/20 border border-primary/30">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  Refer Friends, Get Free Songs
                </CardTitle>
                <CardDescription className="text-base">
                  Share your unique link and earn 1 free credit for each friend who signs up!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-accent/30 border border-border/50">
                    <div className="text-3xl font-bold text-primary">{stats?.totalReferred || 0}</div>
                    <div className="text-xs text-muted-foreground mt-1">Friends Joined</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-accent/30 border border-border/50">
                    <div className="text-3xl font-bold text-primary">{stats?.creditsEarned || 0}</div>
                    <div className="text-xs text-muted-foreground mt-1">Credits Earned</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-accent/30 border border-border/50">
                    <div className="text-3xl font-bold text-primary">{stats?.pendingReferrals || 0}</div>
                    <div className="text-xs text-muted-foreground mt-1">Pending</div>
                  </div>
                </div>

                {/* Referral Code Display */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Your Referral Code
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-accent/50 border border-border/50 font-mono text-lg tracking-wider text-center">
                      {referralLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        referralCode || '...'
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={copyReferralLink}
                      className="px-4"
                      disabled={!referralCode}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Share Your Link</label>
                  <div className="flex gap-3">
                    <Button
                      onClick={copyReferralLink}
                      variant="outline"
                      className="flex-1 gap-2"
                      disabled={!referralCode}
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                    <Button
                      onClick={shareOnTwitter}
                      variant="outline"
                      className="flex-1 gap-2"
                      disabled={!referralCode}
                    >
                      <Twitter className="h-4 w-4" />
                      Share on X
                    </Button>
                  </div>
                </div>

                {/* How it works */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    How it works
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">1.</span>
                      Share your unique referral link with friends
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">2.</span>
                      When they sign up, you BOTH get 1 free credit
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">3.</span>
                      No limit! Refer as many friends as you want
                    </li>
                  </ul>
                </div>
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