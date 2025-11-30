import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ClientAuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, ClientLoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, ClientRegisterData>;
};

type ClientLoginData = {
  username: string;
  password: string;
};

type ClientRegisterData = {
  username: string;
  email: string;
  password: string;
};

export const ClientAuthContext = createContext<ClientAuthContextType | null>(null);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: ClientLoginData) => {
      const res = await apiRequest("POST", "/api/client/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "ACCESS_GRANTED",
        description: "Welcome back, operator.",
        className: "bg-black border border-emerald-500 text-white font-mono rounded-none",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ACCESS_DENIED",
        description: error.message,
        variant: "destructive",
        className: "bg-black border border-red-500 text-white font-mono rounded-none",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: ClientRegisterData) => {
      const res = await apiRequest("POST", "/api/client/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "IDENTITY_CREATED",
        description: "Your secure profile has been established.",
        className: "bg-black border border-emerald-500 text-white font-mono rounded-none",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "REGISTRATION_FAILED",
        description: error.message,
        variant: "destructive",
        className: "bg-black border border-red-500 text-white font-mono rounded-none",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "SESSION_TERMINATED",
        description: "You have been securely logged out.",
        className: "bg-black border border-white/20 text-white font-mono rounded-none",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "LOGOUT_FAILED",
        description: error.message,
        variant: "destructive",
        className: "bg-black border border-red-500 text-white font-mono rounded-none",
      });
    },
  });

  return (
    <ClientAuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}
