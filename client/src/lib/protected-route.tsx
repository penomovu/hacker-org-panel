import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto" />
            <p className="text-xs font-mono text-muted-foreground">VERIFYING_CLEARANCE...</p>
          </div>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/operator-login" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
