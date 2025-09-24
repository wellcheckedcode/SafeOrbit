import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import Navigate from "@/pages/Navigate";
import CurrentLocation from "@/pages/CurrentLocation";
import SOS from "@/pages/SOS";
import ProfileCreate from "@/pages/ProfileCreate";
import Home from "@/pages/Home"; // Crime map view
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/navigate" component={Navigate} />
      <Route path="/current-location" component={CurrentLocation} />
      <Route path="/sos" component={SOS} />
      <Route path="/profile/create" component={ProfileCreate} />
      <Route path="/crime-map" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
