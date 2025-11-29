import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Clock, Target, DollarSign, FileText, RefreshCw, AlertCircle, Loader2, Shield, Users, CheckCircle2, XCircle, Activity, Skull, TrendingUp, Database, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Contract } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  reviewing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  in_progress: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  completed: "bg-white/20 text-white border-white/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const typeLabels: Record<string, string> = {
  target_infiltration: "TARGET_INFILTRATION",
  data_extraction: "DATA_EXTRACTION",
  account_takeover: "ACCOUNT_TAKEOVER",
  network_breach: "NETWORK_BREACH",
};

const typeIcons: Record<string, React.ReactNode> = {
  target_infiltration: <Target className="h-3 w-3" />,
  data_extraction: <Database className="h-3 w-3" />,
  account_takeover: <Users className="h-3 w-3" />,
  network_breach: <Activity className="h-3 w-3" />,
};

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, logoutMutation } = useAuth();

  const { data: contracts, isLoading, error, refetch, isFetching } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
    queryFn: async () => {
      const res = await fetch("/api/contracts");
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/contracts/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "STATUS_UPDATED",
        description: "Contract status has been modified.",
        className: "bg-black border border-emerald-500 text-white font-mono rounded-none",
      });
    },
  });

  const deleteContract = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete contract");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "CONTRACT_TERMINATED",
        description: "Contract has been permanently removed.",
        className: "bg-black border border-red-500 text-white font-mono rounded-none",
      });
    },
  });

  const stats = {
    total: contracts?.length || 0,
    pending: contracts?.filter(c => c.status === "pending").length || 0,
    active: contracts?.filter(c => ["reviewing", "accepted", "in_progress"].includes(c.status)).length || 0,
    completed: contracts?.filter(c => c.status === "completed").length || 0,
    rejected: contracts?.filter(c => c.status === "rejected").length || 0,
  };

  return (
    <Layout>
      <div className="space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 border border-red-500/30">
              <Skull className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter" data-testid="text-admin-title">OPERATOR_CONSOLE</h1>
              <p className="text-xs text-muted-foreground font-mono">RESTRICTED_ACCESS // LEVEL_5_CLEARANCE</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono bg-emerald-500/10 px-3 py-2 border border-emerald-500/20">
              <Activity className="h-3 w-3 animate-pulse" />
              {user?.username?.toUpperCase() || "CONNECTED"}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="font-mono text-xs rounded-none border-white/20"
              data-testid="button-refresh"
            >
              {isFetching ? (
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-2" />
              )}
              SYNC
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="font-mono text-xs rounded-none border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              data-testid="button-logout"
            >
              <LogOut className="h-3 w-3 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-black/40 border-white/10 rounded-none" data-testid="stat-total">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-mono font-bold text-white">{stats.total}</span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mt-2">TOTAL_CONTRACTS</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="bg-yellow-500/5 border-yellow-500/20 rounded-none" data-testid="stat-pending">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-mono font-bold text-yellow-400">{stats.pending}</span>
                </div>
                <p className="text-[10px] font-mono text-yellow-500/60 mt-2">AWAITING_REVIEW</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-purple-500/5 border-purple-500/20 rounded-none" data-testid="stat-active">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-2xl font-mono font-bold text-purple-400">{stats.active}</span>
                </div>
                <p className="text-[10px] font-mono text-purple-500/60 mt-2">ACTIVE_OPS</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="bg-emerald-500/5 border-emerald-500/20 rounded-none" data-testid="stat-completed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-2xl font-mono font-bold text-emerald-400">{stats.completed}</span>
                </div>
                <p className="text-[10px] font-mono text-emerald-500/60 mt-2">EXECUTED</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-red-500/5 border-red-500/20 rounded-none" data-testid="stat-rejected">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-2xl font-mono font-bold text-red-400">{stats.rejected}</span>
                </div>
                <p className="text-[10px] font-mono text-red-500/60 mt-2">DECLINED</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground">ACTIVE_CONTRACTS</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20" data-testid="loading-contracts">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto" />
              <p className="text-xs font-mono text-muted-foreground">FETCHING_CONTRACTS...</p>
            </div>
          </div>
        )}

        {error && (
          <Card className="bg-red-500/10 border-red-500/30 rounded-none" data-testid="error-contracts">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-400 font-mono text-sm">ERROR: FAILED_TO_ESTABLISH_CONNECTION</span>
            </CardContent>
          </Card>
        )}

        {contracts && contracts.length === 0 && (
          <Card className="bg-black/40 border-white/10 rounded-none" data-testid="empty-contracts">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-white/5 border border-white/10 mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-mono text-lg text-muted-foreground">NO_ACTIVE_CONTRACTS</h3>
              <p className="text-xs text-muted-foreground/50 mt-2 font-mono">Awaiting incoming transmissions...</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {contracts?.map((contract, i) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-black/40 border-white/10 rounded-none overflow-hidden hover:border-red-500/30 transition-all duration-300 group" data-testid={`card-contract-${contract.id}`}>
                  <CardHeader className="border-b border-white/5 py-3 px-6 bg-gradient-to-r from-white/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`${statusColors[contract.status]} border font-mono text-[10px] uppercase rounded-none`} data-testid={`badge-status-${contract.id}`}>
                          {contract.status.replace("_", " ")}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                          <span className="text-red-400">CONTRACT:</span>
                          {contract.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                        <Clock className="h-3 w-3" />
                        {format(new Date(contract.createdAt), "yyyy-MM-dd HH:mm")}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] uppercase text-red-400 font-mono">
                          <Target className="h-3 w-3" />
                          TARGET_IDENTIFIER
                        </div>
                        <p className="font-mono text-sm text-white bg-red-500/10 border border-red-500/20 px-3 py-2" data-testid={`text-target-${contract.id}`}>{contract.target}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase text-muted-foreground font-mono">OPERATION_TYPE</div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">{typeIcons[contract.type]}</span>
                          <p className="font-mono text-sm text-emerald-400" data-testid={`text-type-${contract.id}`}>{typeLabels[contract.type]}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] uppercase text-yellow-400 font-mono">
                          <DollarSign className="h-3 w-3" />
                          OFFERED_BOUNTY
                        </div>
                        <p className="font-mono text-sm text-yellow-400" data-testid={`text-bounty-${contract.id}`}>{contract.bounty}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] uppercase text-muted-foreground font-mono">MISSION_BRIEF</div>
                      <p className="font-mono text-xs text-muted-foreground bg-black/50 p-4 border border-white/5 leading-relaxed" data-testid={`text-details-${contract.id}`}>
                        {contract.details}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase text-muted-foreground font-mono">SET_STATUS:</span>
                        <Select
                          value={contract.status}
                          onValueChange={(value) => updateStatus.mutate({ id: contract.id, status: value })}
                        >
                          <SelectTrigger className="w-40 h-8 bg-black border-white/20 font-mono text-xs rounded-none focus:ring-red-500" data-testid={`select-status-${contract.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/20 rounded-none text-white font-mono">
                            <SelectItem value="pending">PENDING</SelectItem>
                            <SelectItem value="reviewing">REVIEWING</SelectItem>
                            <SelectItem value="accepted">ACCEPTED</SelectItem>
                            <SelectItem value="in_progress">IN_PROGRESS</SelectItem>
                            <SelectItem value="completed">COMPLETED</SelectItem>
                            <SelectItem value="rejected">REJECTED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteContract.mutate(contract.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500 font-mono text-xs rounded-none transition-all duration-300"
                        data-testid={`button-delete-${contract.id}`}
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        TERMINATE
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 p-4 border border-white/5 bg-black/20 text-center">
          <p className="text-[10px] font-mono text-muted-foreground/50">
            OPERATOR_CONSOLE_V2.1 // ALL_ACTIONS_LOGGED // UNAUTHORIZED_ACCESS_PROSECUTED
          </p>
        </div>
      </div>
    </Layout>
  );
}
