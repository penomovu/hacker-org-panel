import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Activity, Server, Database, Shield, Lock, Clock, FileText, RefreshCw, Loader2, Wifi, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface SystemStatus {
  server: {
    status: string;
    uptime: string;
    uptimeMs: number;
    nodeVersion: string;
    platform: string;
  };
  database: {
    status: string;
    latency: string;
  };
  system: {
    memory: {
      used: string;
      total: string;
      percentage: string;
    };
    cpu: {
      cores: number;
      load: string;
    };
  };
  contracts: {
    total: number;
    pending: number;
    active: number;
    completed: number;
  };
  timestamp: string;
}

export default function Status() {
  const { data: status, isLoading, refetch, isFetching } = useQuery<SystemStatus>({
    queryKey: ["/api/status"],
    queryFn: async () => {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    },
    refetchInterval: 5000,
  });

  return (
    <Layout>
      <div className="space-y-8 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter" data-testid="text-status-title">System Status</h1>
            <p className="text-xs text-muted-foreground font-mono">REALTIME_NET_DIAGNOSTICS</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="font-mono text-xs rounded-none border-white/20"
              data-testid="button-refresh-status"
            >
              {isFetching ? (
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-2" />
              )}
              REFRESH
            </Button>
            {status && (
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono bg-emerald-500/10 px-3 py-1 border border-emerald-500/20" data-testid="status-indicator">
                <Activity className="h-3 w-3 animate-pulse" />
                ALL_SYSTEMS_NOMINAL
              </div>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20" data-testid="loading-status">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {status && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Server Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-black/40 border-white/10 rounded-none">
                <CardHeader className="border-b border-white/5 pb-3">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Server className="h-3 w-3" />
                    Server_Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">STATUS</span>
                    <span className="text-xs font-mono text-emerald-500" data-testid="text-server-status">{status.server.status}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      UPTIME
                    </span>
                    <span className="text-xs font-mono text-white" data-testid="text-uptime">{status.server.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      ENCRYPTION
                    </span>
                    <span className="text-xs font-mono text-emerald-400">AES-256-GCM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      FIREWALL
                    </span>
                    <span className="text-xs font-mono text-emerald-400">ACTIVE</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Database Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-black/40 border-white/10 rounded-none">
                <CardHeader className="border-b border-white/5 pb-3">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    Database_Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">CONNECTION</span>
                    <span className={`text-xs font-mono ${status.database.status === "ONLINE" ? "text-emerald-500" : "text-red-500"}`} data-testid="text-db-status">
                      {status.database.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">LATENCY</span>
                    <span className="text-xs font-mono text-white" data-testid="text-db-latency">{status.database.latency}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Network Security */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-black/40 border-white/10 rounded-none">
                <CardHeader className="border-b border-white/5 pb-3">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Network_Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                      <Wifi className="h-3 w-3" />
                      TOR_RELAY
                    </span>
                    <span className="text-xs font-mono text-emerald-400">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">VPN_TUNNEL</span>
                    <span className="text-xs font-mono text-emerald-400">ENCRYPTED</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">PROXY_CHAIN</span>
                    <span className="text-xs font-mono text-white">7_NODES</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">THREAT_LEVEL</span>
                    <span className="text-xs font-mono text-yellow-400">MODERATE</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contract Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-black/40 border-white/10 rounded-none">
                <CardHeader className="border-b border-white/5 pb-3">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    Contract_Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">TOTAL_CONTRACTS</span>
                    <span className="text-xs font-mono text-white" data-testid="text-total-contracts">{status.contracts.total}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">PENDING</span>
                    <span className="text-xs font-mono text-yellow-400" data-testid="text-pending-contracts">{status.contracts.pending}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">ACTIVE</span>
                    <span className="text-xs font-mono text-emerald-400" data-testid="text-active-contracts">{status.contracts.active}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground">COMPLETED</span>
                    <span className="text-xs font-mono text-white" data-testid="text-completed-contracts">{status.contracts.completed}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {status && (
          <div className="text-center text-[10px] font-mono text-muted-foreground/50 pt-4">
            LAST_SYNC: {new Date(status.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </Layout>
  );
}
