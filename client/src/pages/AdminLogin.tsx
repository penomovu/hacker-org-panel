import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Skull, Lock, User, Loader2, Shield, Terminal } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/operator-console-7x3");
    }
  }, [user, setLocation]);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginData) {
    loginMutation.mutate(values);
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex p-4 bg-red-500/10 border border-red-500/30">
              <Skull className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter" data-testid="text-login-title">
                OPERATOR_AUTH
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-2">
                RESTRICTED_ACCESS // LEVEL_5_CLEARANCE_REQUIRED
              </p>
            </div>
          </div>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm rounded-none overflow-hidden relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-red-500/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-red-500/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-red-500/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-red-500/50" />

            <CardHeader className="border-b border-white/5 bg-red-500/5">
              <CardTitle className="font-mono text-sm tracking-widest flex items-center gap-2 text-red-400">
                <Terminal className="h-4 w-4" />
                SECURE_LOGIN_TERMINAL
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                          <User className="h-3 w-3" />
                          Operator ID
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="OPERATOR_ID"
                            {...field}
                            className="bg-black border-white/20 focus:border-red-500 font-mono rounded-none h-12 placeholder:text-white/20"
                            data-testid="input-username"
                          />
                        </FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                          <Lock className="h-3 w-3" />
                          Access Key
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            {...field}
                            className="bg-black border-white/20 focus:border-red-500 font-mono rounded-none h-12 placeholder:text-white/20"
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loginMutation.isPending}
                      className="w-full h-14 bg-red-500 text-white hover:bg-red-600 transition-colors rounded-none font-mono tracking-widest uppercase text-xs border border-transparent"
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Shield className="h-4 w-4 mr-2" />
                      )}
                      {loginMutation.isPending ? "AUTHENTICATING..." : "AUTHENTICATE"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 border border-white/5 bg-black/20 text-center">
            <p className="text-[10px] font-mono text-muted-foreground/50">
              WARNING: UNAUTHORIZED ACCESS WILL BE LOGGED AND TRACED
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
