
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AudioProvider } from "./contexts/AudioContext";
import { MiniPlayer } from "./components/audio/MiniPlayer";
import { Dashboard } from "./pages/Dashboard";
import { TripOnboarding } from "./pages/TripOnboarding";
import TripAlbum from "./pages/TripAlbum";
import { TripWizard } from "./components/TripWizard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import SharedTripAlbum from "./pages/SharedTripAlbum";
import SharedSong from "./pages/SharedSong";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/share/trip/:tripId" element={<SharedTripAlbum />} />
            <Route path="/share/song/:songId" element={<SharedSong />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/trip/new" element={<TripOnboarding />} />
                  <Route path="/trip/plan" element={<TripWizard />} />
                  <Route path="/trip/:tripId" element={<TripAlbum />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <MiniPlayer />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AudioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
