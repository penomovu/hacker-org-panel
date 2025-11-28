import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Upload, ShieldAlert, Loader2, CheckCircle } from "lucide-react";

const formSchema = z.object({
  target: z.string().min(2, "Target identifier required"),
  type: z.enum(["infiltration", "extraction", "audit", "ddos", "recovery"]),
  details: z.string().min(10, "More intelligence required"),
  bounty: z.string().min(1, "Bounty offer required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Request() {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: "",
      type: "infiltration",
      details: "",
      bounty: "",
    },
  });

  const submitContract = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit contract");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "TRANSMISSION_COMPLETE",
        description: "Your contract has been encrypted and queued for review.",
        className: "bg-black border border-emerald-500 text-white font-mono rounded-none",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "TRANSMISSION_FAILED",
        description: error.message,
        className: "bg-black border border-red-500 text-white font-mono rounded-none",
      });
    },
  });

  function onSubmit(values: FormData) {
    submitContract.mutate(values);
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pt-12">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter font-mono uppercase" data-testid="text-page-title">New Contract</h1>
          <p className="text-muted-foreground font-mono text-xs">
            SECURE_FORM_ID: {Math.random().toString(16).slice(2).toUpperCase()}
          </p>
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-sm rounded-none overflow-hidden relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/50" />

          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="font-mono text-sm tracking-widest flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />
              CLASSIFIED_INPUT_TERMINAL
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Target Identifier</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="IP / DOMAIN / ENTITY" 
                            {...field} 
                            className="bg-black border-white/20 focus:border-white font-mono rounded-none h-12 placeholder:text-white/20"
                            data-testid="input-target"
                          />
                        </FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Operation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black border-white/20 focus:border-white font-mono rounded-none h-12" data-testid="select-type">
                              <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black border-white/20 rounded-none text-white font-mono">
                            <SelectItem value="infiltration">DATA_INFILTRATION</SelectItem>
                            <SelectItem value="extraction">ASSET_EXTRACTION</SelectItem>
                            <SelectItem value="audit">SECURITY_AUDIT</SelectItem>
                            <SelectItem value="ddos">STRESS_TESTING</SelectItem>
                            <SelectItem value="recovery">ACCOUNT_RECOVERY</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Mission Parameters</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe objectives and constraints..." 
                          {...field} 
                          className="bg-black border-white/20 focus:border-white font-mono rounded-none min-h-[150px] placeholder:text-white/20 resize-none"
                          data-testid="textarea-details"
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bounty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Bounty Offer (BTC/XMR/USD)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0.00" 
                          {...field} 
                          className="bg-black border-white/20 focus:border-white font-mono rounded-none h-12 placeholder:text-white/20"
                          data-testid="input-bounty"
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={submitContract.isPending}
                    className="w-full h-14 bg-white text-black hover:bg-emerald-400 hover:text-black transition-colors rounded-none font-mono tracking-widest uppercase text-xs border border-transparent"
                    data-testid="button-submit"
                  >
                    {submitContract.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {submitContract.isPending ? "ENCRYPTING..." : "TRANSMIT_REQUEST"}
                  </Button>
                  <p className="text-center mt-4 text-[10px] text-muted-foreground/50 font-mono">
                    BY SUBMITTING, YOU AGREE TO THE NON-DISCLOSURE PROTOCOLS.
                  </p>
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
