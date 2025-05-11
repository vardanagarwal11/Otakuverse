import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AnimeLibrary from "./pages/AnimeLibrary";
import WatchPage from "./pages/WatchPage";
import Communities from "./pages/Communities";
import NotFound from "./pages/NotFound";
import CommunitiesShowcase from "@/components/CommunitiesShowcase";
import CommunityPage from "@/pages/CommunityPage";
import { createElement } from "react";

// Create a client
const queryClient = new QueryClient();

// Fix the function component syntax
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/anime" element={<AnimeLibrary />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/about" element={<NotFound />} />
            <Route path="/services" element={<NotFound />} />
            <Route path="/marketplace" element={<NotFound />} />
            <Route path="/creators" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
