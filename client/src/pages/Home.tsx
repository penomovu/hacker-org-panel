import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Lock, Eye, Terminal as TerminalIcon, Shield, Skull, Database, Wifi, Users, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const services = [
    { 
      title: "ACCOUNT_TAKEOVER", 
      icon: Users, 
      desc: "Complete access acquisition. Social media, email, financial, and corporate accounts.",
      price: "$50 - $100"
    },
    { 
      title: "NETWORK_INFILTRATION", 
      icon: Wifi, 
      desc: "Corporate and personal network infiltration. Full traffic interception and monitoring.",
      price: "$300"
    },
    { 
      title: "TARGET_INFILTRATION", 
      icon: Crosshair, 
      desc: "Full access penetration. Social engineering, credential harvesting, and system compromise.",
      price: "$400 - $500"
    },
    { 
      title: "DATA_EXTRACTION", 
      icon: Database, 
      desc: "Secure retrieval of sensitive information. Emails, messages, files, and communications.",
      price: "$300"
    },
  ];

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-[10px] font-mono tracking-widest text-red-400">
            <Skull className="h-3 w-3" />
            SECURE_DARK_CHANNEL_ACTIVE
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-sans leading-none" data-testid="text-main-title">
            PROFESSIONAL <br />
            <span className="text-red-500">HACKING</span> SERVICES
          </h1>

          <div className="h-px w-24 bg-red-500" />

          <p className="text-muted-foreground max-w-xl leading-relaxed font-mono text-sm md:text-base" data-testid="text-description">
            Elite operatives standing by. We specialize in <span className="text-white">target acquisition</span>, 
            <span className="text-white"> data exfiltration</span>, and <span className="text-white">digital compromise</span>. 
            No target is beyond reach. Complete anonymity guaranteed.
            <br /><br />
            <span className="text-red-400 font-bold">Submit your target. We execute.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/request">
              <Button className="h-12 px-8 bg-red-600 text-white hover:bg-red-500 hover:scale-105 transition-all duration-300 font-mono tracking-widest text-xs border border-red-500 rounded-none" data-testid="button-submit-target">
                SUBMIT_TARGET
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="outline" className="h-12 px-8 border-white/20 hover:bg-white/10 hover:text-white font-mono tracking-widest text-xs rounded-none bg-transparent text-muted-foreground" data-testid="button-view-services">
              <Shield className="mr-2 h-4 w-4" />
              VIEW_CAPABILITIES
            </Button>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-12">
          {[
            { title: "TOTAL_ANONYMITY", icon: Eye, desc: "Zero trace operations. Your identity is protected at all costs." },
            { title: "RAPID_EXECUTION", icon: TerminalIcon, desc: "24-72 hour turnaround on most targets." },
            { title: "ENCRYPTED_COMMS", icon: Lock, desc: "Military-grade encryption. End-to-end secure channels." },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (i + 1), duration: 0.5 }}
              className="space-y-3"
              data-testid={`feature-${i}`}
            >
              <item.icon className="h-6 w-6 text-red-400" />
              <h3 className="font-mono text-sm font-bold text-white tracking-widest">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground">SERVICE_CATALOG</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
              >
                <Card className="bg-black/40 border-white/10 rounded-none hover:border-red-500/30 transition-colors group cursor-pointer" data-testid={`service-card-${i}`}>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <service.icon className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors" />
                      <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-bold">{service.price}</span>
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white tracking-wider">{service.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono leading-relaxed">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-20 p-6 border border-red-500/20 bg-red-500/5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Skull className="h-5 w-5 text-red-500" />
            <h3 className="font-mono text-sm font-bold text-red-400 tracking-wider">OPERATIONAL_GUIDELINES</h3>
          </div>
          <ul className="space-y-2 text-xs font-mono text-muted-foreground" data-testid="guidelines-list">
            <li className="flex items-start gap-2">
              <span className="text-red-500">01.</span>
              <span>All payments in cryptocurrency only. No refunds after operation commences.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">02.</span>
              <span>Provide detailed target information for accurate quotes and faster execution.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">03.</span>
              <span>Do not share our channel. Referral by existing clients only.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">04.</span>
              <span>We reserve the right to decline any contract at our discretion.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </Layout>
  );
}
