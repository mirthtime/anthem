
import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AudioProvider } from "./contexts/AudioContext";
import { MiniPlayer } from "./components/audio/MiniPlayer";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const TripOnboarding = lazy(() => import("./pages/TripOnboarding").then(m => ({ default: m.TripOnboarding })));
const TripAlbum = lazy(() => import("./pages/TripAlbum"));
const TripWizard = lazy(() => import("./components/TripWizard").then(m => ({ default: m.TripWizard })));
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Settings = lazy(() => import("./pages/Settings"));
const SharedTripAlbum = lazy(() => import("./pages/SharedTripAlbum"));
const SharedSong = lazy(() => import("./pages/SharedSong"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component for lazy loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="h-8 w-8 text-primary" />
    </motion.div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/share/trip/:tripId" element={<SharedTripAlbum />} />
              <Route path="/share/song/:songId" element={<SharedSong />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Navigation />
                  <Dashboard />
                  <MiniPlayer />
                </ProtectedRoute>
              } />
              <Route path="/trip/new" element={
                <ProtectedRoute>
                  <Navigation />
                  <TripOnboarding />
                  <MiniPlayer />
                </ProtectedRoute>
              } />
              <Route path="/trip/plan" element={
                <ProtectedRoute>
                  <Navigation />
                  <TripWizard />
                  <MiniPlayer />
                </ProtectedRoute>
              } />
              <Route path="/trip/:tripId" element={
                <ProtectedRoute>
                  <Navigation />
                  <TripAlbum />
                  <MiniPlayer />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Navigation />
                  <Settings />
                  <MiniPlayer />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
