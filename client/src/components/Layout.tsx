import { Link, useLocation } from "wouter";
import { Terminal, FileText, Activity, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClientAuth } from "@/hooks/use-client-auth";
import noiseTexture from "@assets/generated_images/subtle_dark_digital_noise_texture.png";
import frakturLogo from "@assets/aec786bb-86a6-4f0f-a7f1-dd5509603aa8__1_-removebg-preview_1764458176929.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useClientAuth();

  const navItems = [
    { href: "/", label: "TERMINAL", icon: Terminal },
    { href: "/request", label: "NEW_CONTRACT", icon: FileText },
    { href: "/status", label: "NETWORK_STATUS", icon: Activity },
  ];

  return (
    <div 
      className="min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary selection:text-background relative overflow-hidden flex flex-col"
      style={{
        backgroundImage: `url(${noiseTexture})`,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover'
      }}
    >
      {/* CRT Scanline Effect */}
      <div className="scanline z-50 pointer-events-none fixed inset-0" />
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/90 backdrop-blur-md flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src={frakturLogo} 
              alt="Fraktur Logo" 
              className="h-10 w-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
              style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(98%) saturate(2000%) hue-rotate(343deg) brightness(95%) contrast(95%)' }}
            />
            <span className="text-red-500 font-bold text-lg tracking-widest font-mono">FRAKTUR</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-widest transition-all duration-200 border border-transparent cursor-pointer",
                  isActive 
                    ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                    : "text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/5"
                )} data-testid={`nav-${item.href.replace("/", "") || "home"}`}>
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link href={user ? "/dashboard" : "/portal"}>
          <Button className="h-10 px-6 bg-red-500 text-white hover:bg-red-600 transition-all duration-300 font-mono tracking-widest text-xs border border-red-500 rounded-none" data-testid={user ? "button-account" : "button-connect"}>
            {user ? <User className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
            {user ? "ACCOUNT" : "CONNECT"}
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto pt-16">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
