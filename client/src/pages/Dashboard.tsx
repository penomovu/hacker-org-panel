import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  LogOut,
  Plus,
  Target,
  User
} from "lucide-react";
import { Contract } from "@shared/schema";
import { format } from "date-fns";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "PENDING", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  reviewing: { label: "REVIEWING", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: AlertCircle },
  accepted: { label: "ACCEPTED", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  in_progress: { label: "IN_PROGRESS", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Target },
  completed: { label: "COMPLETED", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  rejected: { label: "REJECTED", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
};

const typeLabels: Record<string, string> = {
  target_infiltration: "TARGET_INFILTRATION",
  data_extraction: "DATA_EXTRACTION",
  account_takeover: "ACCOUNT_TAKEOVER",
  network_breach: "NETWORK_BREACH",
};

export default function Dashboard() {
  const { user, logoutMutation, isLoading: authLoading } = useClientAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/portal");
    }
  }, [user, authLoading, setLocation]);

  const { data: contracts, isLoading, error, refetch, isFetching } = useQuery<Contract[]>({
    queryKey: ["/api/client/contracts"],
    queryFn: async () => {
      const res = await fetch("/api/client/contracts");
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return res.json();
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
            <p className="text-xs font-mono text-muted-foreground">LOADING_PROFILE...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    total: contracts?.length || 0,
    pending: contracts?.filter(c => c.status === "pending" || c.status === "reviewing").length || 0,
    active: contracts?.filter(c => c.status === "accepted" || c.status === "in_progress").length || 0,
    completed: contracts?.filter(c => c.status === "completed").length || 0,
  };

  return (
    <Layout>
      <div className="space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30">
              <User className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono uppercase tracking-tighter" data-testid="text-dashboard-title">
                CLIENT_DASHBOARD
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                OPERATOR: {user.username.toUpperCase()} // {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/request">
              <Button 
                variant="outline" 
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-none font-mono text-xs"
                data-testid="button-new-contract"
              >
                <Plus className="h-4 w-4 mr-2" />
                NEW_CONTRACT
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-white/20 hover:bg-white/5 rounded-none font-mono text-xs"
              data-testid="button-refresh"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "SYNCING..." : "REFRESH"}
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-none font-mono text-xs"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-black/40 border-white/10 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Total Contracts</p>
                  <p className="text-2xl font-bold font-mono text-white" data-testid="stat-total">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-white/20" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-yellow-500/20 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Pending</p>
                  <p className="text-2xl font-bold font-mono text-yellow-400" data-testid="stat-pending">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-purple-500/20 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Active</p>
                  <p className="text-2xl font-bold font-mono text-purple-400" data-testid="stat-active">{stats.active}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-emerald-500/20 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Completed</p>
                  <p className="text-2xl font-bold font-mono text-emerald-400" data-testid="stat-completed">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 border-white/10 rounded-none">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="font-mono text-sm tracking-widest flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              YOUR_CONTRACTS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400 font-mono text-sm">
                ERROR_LOADING_CONTRACTS
              </div>
            ) : contracts?.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-white/10 mx-auto mb-4" />
                <p className="text-muted-foreground font-mono text-sm">NO_CONTRACTS_FOUND</p>
                <p className="text-muted-foreground/50 font-mono text-xs mt-2">Submit your first contract to get started</p>
                <Link href="/request">
                  <Button className="mt-4 bg-emerald-500 text-black hover:bg-emerald-600 rounded-none font-mono text-xs">
                    <Plus className="h-4 w-4 mr-2" />
                    CREATE_CONTRACT
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {contracts?.map((contract) => {
                  const status = statusConfig[contract.status];
                  const StatusIcon = status.icon;
                  return (
                    <div 
                      key={contract.id} 
                      className="p-4 hover:bg-white/5 transition-colors"
                      data-testid={`contract-row-${contract.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/5 border border-white/10">
                            <Target className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-white" data-testid={`contract-target-${contract.id}`}>
                                {contract.target}
                              </span>
                              <Badge className={`${status.color} border rounded-none font-mono text-[10px]`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {typeLabels[contract.type] || contract.type}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground/50">
                                ID: {contract.id.slice(0, 8).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono text-emerald-400" data-testid={`contract-bounty-${contract.id}`}>
                            {contract.bounty || "TBD"}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground/50 mt-1">
                            {format(new Date(contract.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-black/30 border border-white/5">
                        <p className="text-xs font-mono text-muted-foreground line-clamp-2">
                          {contract.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-4 border border-white/5 bg-black/20 text-center">
          <p className="text-[10px] font-mono text-muted-foreground/50">
            CLIENT_PORTAL_V1.0 // CONTRACTS_AUTO_SYNC_EVERY_30S // SECURE_CONNECTION
          </p>
        </div>
      </div>
    </Layout>
  );
}
