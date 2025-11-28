import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Lock, Eye, Terminal as TerminalIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono tracking-widest text-muted-foreground">
            <Lock className="h-3 w-3" />
            ENCRYPTED_CONNECTION_ESTABLISHED
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-sans leading-none">
            ELITE DIGITAL <br />
            <span className="text-muted-foreground">SOLUTIONS.</span>
          </h1>

          <div className="h-px w-24 bg-white" />

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-mono text-sm md:text-base">
            We provide discreet, high-level digital intervention services. 
            Infiltration, data retrieval, and security auditing for select clients.
            <br /><br />
            <span className="text-white terminal-cursor">Prepare your objective.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/request">
              <Button className="h-12 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 font-mono tracking-widest text-xs border border-white rounded-none">
                INITIATE_REQUEST
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="outline" className="h-12 px-8 border-white/20 hover:bg-white/10 hover:text-white font-mono tracking-widest text-xs rounded-none bg-transparent text-muted-foreground">
              VIEW_CAPABILITIES
            </Button>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-12">
          {[
            { title: "ANONYMITY", icon: Eye, desc: "Identity protection protocols active." },
            { title: "EFFICIENCY", icon: TerminalIcon, desc: "Zero-day execution speed." },
            { title: "SECURITY", icon: Lock, desc: "Military-grade encryption standard." },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (i + 1), duration: 0.5 }}
              className="space-y-3"
            >
              <item.icon className="h-6 w-6 text-muted-foreground" />
              <h3 className="font-mono text-sm font-bold text-white tracking-widest">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
