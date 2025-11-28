import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Clock, Target, DollarSign, FileText, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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
  infiltration: "DATA_INFILTRATION",
  extraction: "ASSET_EXTRACTION",
  audit: "SECURITY_AUDIT",
  ddos: "STRESS_TESTING",
  recovery: "ACCOUNT_RECOVERY",
};

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contracts, isLoading, error, refetch } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
    queryFn: async () => {
      const res = await fetch("/api/contracts");
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return res.json();
    },
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
        className: "bg-black border border-white text-white font-mono rounded-none",
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

  return (
    <Layout>
      <div className="space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter" data-testid="text-admin-title">ADMIN_CONSOLE</h1>
            <p className="text-xs text-muted-foreground font-mono">CONTRACT_MANAGEMENT_SYSTEM</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            className="font-mono text-xs rounded-none border-white/20"
            data-testid="button-refresh"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            REFRESH
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20" data-testid="loading-contracts">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Card className="bg-red-500/10 border-red-500/30 rounded-none" data-testid="error-contracts">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-400 font-mono text-sm">ERROR: Failed to fetch contracts</span>
            </CardContent>
          </Card>
        )}

        {contracts && contracts.length === 0 && (
          <Card className="bg-black/40 border-white/10 rounded-none" data-testid="empty-contracts">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-mono text-lg text-muted-foreground">NO_CONTRACTS_FOUND</h3>
              <p className="text-xs text-muted-foreground/50 mt-2 font-mono">Waiting for incoming transmissions...</p>
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
                <Card className="bg-black/40 border-white/10 rounded-none overflow-hidden hover:border-white/20 transition-colors" data-testid={`card-contract-${contract.id}`}>
                  <CardHeader className="border-b border-white/5 py-3 px-6 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`${statusColors[contract.status]} border font-mono text-[10px] uppercase rounded-none`} data-testid={`badge-status-${contract.id}`}>
                          {contract.status.replace("_", " ")}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          ID: {contract.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                        <Clock className="h-3 w-3" />
                        {format(new Date(contract.createdAt), "yyyy-MM-dd HH:mm")}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] uppercase text-muted-foreground font-mono">
                          <Target className="h-3 w-3" />
                          Target
                        </div>
                        <p className="font-mono text-sm text-white" data-testid={`text-target-${contract.id}`}>{contract.target}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase text-muted-foreground font-mono">Type</div>
                        <p className="font-mono text-sm text-emerald-400" data-testid={`text-type-${contract.id}`}>{typeLabels[contract.type]}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] uppercase text-muted-foreground font-mono">
                          <DollarSign className="h-3 w-3" />
                          Bounty
                        </div>
                        <p className="font-mono text-sm text-yellow-400" data-testid={`text-bounty-${contract.id}`}>{contract.bounty}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase text-muted-foreground font-mono">Mission Details</div>
                      <p className="font-mono text-xs text-muted-foreground bg-black/50 p-3 border border-white/5" data-testid={`text-details-${contract.id}`}>
                        {contract.details}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase text-muted-foreground font-mono">Update Status:</span>
                        <Select
                          value={contract.status}
                          onValueChange={(value) => updateStatus.mutate({ id: contract.id, status: value })}
                        >
                          <SelectTrigger className="w-40 h-8 bg-black border-white/20 font-mono text-xs rounded-none" data-testid={`select-status-${contract.id}`}>
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
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-mono text-xs rounded-none"
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
      </div>
    </Layout>
  );
}
