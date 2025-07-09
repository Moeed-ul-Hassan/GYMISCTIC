import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Preloader } from "@/components/layout/preloader";
import { BottomNavigation } from "@/components/layout/bottom-navigation";

// Pages
import Home from "@/pages/home";
import Workout from "@/pages/workout";
import Meals from "@/pages/meals";
import Progress from "@/pages/progress";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/workout" component={Workout} />
      <Route path="/meals" component={Meals} />
      <Route path="/progress" component={Progress} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useState("/");

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
    window.history.pushState({}, "", path);
  };

  // Add FontAwesome CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);

    // Add Google Fonts
    const googleFonts = document.createElement('link');
    googleFonts.rel = 'stylesheet';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Amiri:wght@400;700&family=Orbitron:wght@400;700;900&display=swap';
    document.head.appendChild(googleFonts);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(googleFonts);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          {isLoading ? (
            <Preloader onComplete={handlePreloaderComplete} />
          ) : (
            <>
              <Router />
              <BottomNavigation onNavigate={handleNavigation} />
            </>
          )}
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
