
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Home, Settings, CreditCard, Menu, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { CreditPurchaseModal } from '@/components/CreditPurchaseModal';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { balance } = useCredits();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      // Even if sign out fails, navigate to landing page
      navigate('/');
      setIsMobileMenuOpen(false);
    }
  };

  const handleCreateTrip = () => {
    navigate('/trip/new');
    setIsMobileMenuOpen(false);
  };

  const handleCreditsClick = () => {
    setIsCreditModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="w-full max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-full bg-gradient-primary">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">TripTunes AI</span>
            </Link>

            {/* Nav Items */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActivePath(item.path)
                      ? 'bg-gradient-primary text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}

              {/* Credits Display - Clickable */}
              <button
                onClick={handleCreditsClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-card border border-border hover:bg-accent transition-all"
              >
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {balance?.available_credits || 0} credits
                </span>
              </button>

              {/* Create Memory Button */}
              <Button onClick={handleCreateTrip} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Capture Memory
              </Button>

              {/* User Menu */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-gradient-primary">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">TripTunes</span>
            </Link>

            {/* Credits & Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreditsClick}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-card border border-border hover:bg-accent transition-all text-xs"
              >
                <CreditCard className="h-3 w-3 text-primary" />
                <span className="font-medium">{balance?.available_credits || 0}</span>
              </button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-background"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActivePath(item.path)
                        ? 'bg-gradient-primary text-white'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                
                <Button 
                  onClick={handleCreateTrip} 
                  className="w-full gap-2 justify-start"
                  variant="secondary"
                >
                  <Plus className="h-5 w-5" />
                  Capture a Memory
                </Button>

                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground"
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Credit Purchase Modal */}
      <CreditPurchaseModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
      />

      {/* Spacer for fixed navigation */}
      <div className="h-20 lg:h-24" />
    </>
  );
};
