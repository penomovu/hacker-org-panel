import { Link, useLocation } from "wouter";
import { Terminal, FileText, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import noiseTexture from "@assets/generated_images/subtle_dark_digital_noise_texture.png";
import frakturLogo from "@assets/fraktur_logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "TERMINAL", icon: Terminal },
    { href: "/request", label: "NEW_CONTRACT", icon: FileText },
    { href: "/status", label: "NETWORK_STATUS", icon: Activity },
  ];

  return (
    <div 
      className="min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary selection:text-background relative overflow-hidden flex"
      style={{
        backgroundImage: `url(${noiseTexture})`,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover'
      }}
    >
      {/* CRT Scanline Effect */}
      <div className="scanline z-50 pointer-events-none fixed inset-0" />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm hidden md:flex flex-col p-6 z-10">
        <div className="mb-12 flex items-center justify-center">
          <img 
            src={frakturLogo} 
            alt="Fraktur Logo" 
            className="h-32 w-32 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
            style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(98%) saturate(2000%) hue-rotate(343deg) brightness(95%) contrast(95%)' }}
          />
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-widest transition-all duration-200 group relative overflow-hidden border border-transparent cursor-pointer",
                isActive 
                  ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                  : "text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/5"
              )} data-testid={`nav-${item.href.replace("/", "") || "home"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM_ONLINE</span>
          </div>
          <div className="mt-1 text-[10px] font-mono text-muted-foreground/50">
            ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/90 backdrop-blur-md flex items-center justify-between px-6 z-40">
         <div className="flex items-center">
          <img 
            src={frakturLogo} 
            alt="Fraktur Logo" 
            className="h-12 w-12 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
            style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(98%) saturate(2000%) hue-rotate(343deg) brightness(95%) contrast(95%)' }}
          />
         </div>
         <nav className="flex gap-4">
            <Link href="/" className="text-xs font-mono cursor-pointer">TERM</Link>
            <Link href="/request" className="text-xs font-mono cursor-pointer">NEW</Link>
            <Link href="/status" className="text-xs font-mono cursor-pointer">STATUS</Link>
         </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
