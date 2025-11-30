import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useClientAuth } from "@/hooks/use-client-auth";
import { Shield, Lock, User, Loader2, Terminal, Mail, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function ClientAuth() {
  const { user, loginMutation, registerMutation } = useClientAuth();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  function onLogin(values: LoginData) {
    loginMutation.mutate(values);
  }

  function onRegister(values: RegisterData) {
    registerMutation.mutate({
      username: values.username,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex p-4 bg-red-500/10 border border-red-500/30">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono uppercase tracking-tighter" data-testid="text-auth-title">
                CLIENT_PORTAL
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-2">
                SECURE_ACCESS // TRACK_YOUR_CONTRACTS
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
                IDENTITY_VERIFICATION
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/50 rounded-none border border-white/10">
                  <TabsTrigger 
                    value="login" 
                    className="font-mono text-xs rounded-none data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                    data-testid="tab-login"
                  >
                    LOGIN
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="font-mono text-xs rounded-none data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                    data-testid="tab-register"
                  >
                    REGISTER
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                              <User className="h-3 w-3" />
                              Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter username"
                                {...field}
                                className="bg-black border-white/20 focus:border-red-500 font-mono rounded-none h-12 placeholder:text-white/20"
                                data-testid="input-login-username"
                              />
                            </FormControl>
                            <FormMessage className="font-mono text-[10px]" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                              <Lock className="h-3 w-3" />
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••••••"
                                  {...field}
                                  className="bg-black border-white/20 focus:border-emerald-500 font-mono rounded-none h-12 placeholder:text-white/20 pr-10"
                                  data-testid="input-login-password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="font-mono text-[10px]" />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full h-14 bg-red-500 text-white hover:bg-red-600 transition-colors rounded-none font-mono tracking-widest uppercase text-xs font-bold"
                        data-testid="button-login"
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Shield className="h-4 w-4 mr-2" />
                        )}
                        {loginMutation.isPending ? "AUTHENTICATING..." : "ACCESS_PORTAL"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register" className="mt-6">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                              <User className="h-3 w-3" />
                              Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Choose username"
                                {...field}
                                className="bg-black border-white/20 focus:border-red-500 font-mono rounded-none h-12 placeholder:text-white/20"
                                data-testid="input-register-username"
                              />
                            </FormControl>
                            <FormMessage className="font-mono text-[10px]" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                {...field}
                                className="bg-black border-white/20 focus:border-red-500 font-mono rounded-none h-12 placeholder:text-white/20"
                                data-testid="input-register-email"
                              />
                            </FormControl>
                            <FormMessage className="font-mono text-[10px]" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                              <Lock className="h-3 w-3" />
                              Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Min 8 chars, upper, lower, number"
                                {...field}
                                className="bg-black border-white/20 focus:border-red-500 font-mono rounded-none h-12 placeholder:text-white/20"
                                data-testid="input-register-password"
                              />
                            </FormControl>
                            <FormMessage className="font-mono text-[10px]" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-2">
                              <Lock className="h-3 w-3" />
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Re-enter password"
                                {...field}
                                className="bg-black border-white/20 focus:border-red-500 font-mono rounded-none h-12 placeholder:text-white/20"
                                data-testid="input-register-confirm"
                              />
                            </FormControl>
                            <FormMessage className="font-mono text-[10px]" />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full h-14 bg-red-500 text-white hover:bg-red-600 transition-colors rounded-none font-mono tracking-widest uppercase text-xs font-bold mt-2"
                        data-testid="button-register"
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Shield className="h-4 w-4 mr-2" />
                        )}
                        {registerMutation.isPending ? "CREATING_IDENTITY..." : "CREATE_IDENTITY"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 border border-white/5 bg-black/20 text-center">
            <p className="text-[10px] font-mono text-muted-foreground/50">
              ENCRYPTED_CONNECTION // ALL_DATA_SECURED
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
