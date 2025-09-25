import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import Navigate from "@/pages/Navigate";
import CurrentLocation from "@/pages/CurrentLocation";
import SOS from "@/pages/SOS";
// import ProfileCreate from "@/pages/ProfileCreate";
import Home from "@/pages/Home"; // Crime map view
import NotFound from "@/pages/not-found";
import { createContext, useState, useEffect } from "react";
import { UserProfile } from "@shared/schema";

export const AuthContext = createContext<{
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}>({
  user: null,
  setUser: () => {},
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/navigate" component={Navigate} />
      <Route path="/current-location" component={CurrentLocation} />
      <Route path="/sos" component={SOS} />
      {/* Removed /profile/create route */}
      <Route path="/crime-map" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
