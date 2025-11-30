import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ClientAuthProvider } from "@/hooks/use-client-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Request from "@/pages/Request";
import Status from "@/pages/Status";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import ClientAuth from "@/pages/ClientAuth";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/request" component={Request} />
      <Route path="/status" component={Status} />
      <Route path="/portal" component={ClientAuth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/auth-e9b7d4a2-5c1f-4e8a-b6d3-7f2a1c9e0b4d" component={AdminLogin} />
      <ProtectedRoute path="/ctrl-f7a2c8e1-4b9d-4f6a-a3c8-9d1e0f3b5a7c" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ClientAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
