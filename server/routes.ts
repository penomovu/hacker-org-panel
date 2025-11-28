import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContractSchema, updateContractStatusSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import os from "os";

// Track server start time
const serverStartTime = Date.now();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ CONTRACT ROUTES ============
  
  // Create a new contract
  app.post("/api/contracts", async (req, res) => {
    try {
      const parsed = insertContractSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: fromZodError(parsed.error).message 
        });
      }
      
      const contract = await storage.createContract(parsed.data);
      res.status(201).json(contract);
    } catch (error) {
      console.error("Error creating contract:", error);
      res.status(500).json({ error: "Failed to create contract" });
    }
  });

  // Get all contracts (admin)
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getAllContracts();
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  // Get single contract
  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const contract = await storage.getContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Error fetching contract:", error);
      res.status(500).json({ error: "Failed to fetch contract" });
    }
  });

  // Update contract status
  app.patch("/api/contracts/:id/status", async (req, res) => {
    try {
      const parsed = updateContractStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: fromZodError(parsed.error).message 
        });
      }

      const contract = await storage.updateContractStatus(req.params.id, parsed.data.status);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Error updating contract:", error);
      res.status(500).json({ error: "Failed to update contract" });
    }
  });

  // Delete contract
  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContract(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contract:", error);
      res.status(500).json({ error: "Failed to delete contract" });
    }
  });

  // ============ SYSTEM STATUS ROUTE ============
  
  app.get("/api/status", async (req, res) => {
    try {
      const uptime = Date.now() - serverStartTime;
      const uptimeSeconds = Math.floor(uptime / 1000);
      const uptimeMinutes = Math.floor(uptimeSeconds / 60);
      const uptimeHours = Math.floor(uptimeMinutes / 60);
      
      // Check database connectivity
      let dbStatus = "OFFLINE";
      let dbLatency = 0;
      try {
        const dbStart = Date.now();
        await storage.getAllContracts();
        dbLatency = Date.now() - dbStart;
        dbStatus = "ONLINE";
      } catch {
        dbStatus = "ERROR";
      }

      // Get contract stats
      let contractStats = { total: 0, pending: 0, active: 0, completed: 0 };
      try {
        const contracts = await storage.getAllContracts();
        contractStats = {
          total: contracts.length,
          pending: contracts.filter(c => c.status === "pending" || c.status === "reviewing").length,
          active: contracts.filter(c => c.status === "accepted" || c.status === "in_progress").length,
          completed: contracts.filter(c => c.status === "completed" || c.status === "rejected").length,
        };
      } catch {}

      const status = {
        server: {
          status: "ONLINE",
          uptime: `${uptimeHours}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`,
          uptimeMs: uptime,
          nodeVersion: process.version,
          platform: process.platform,
        },
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
        },
        system: {
          memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
            percentage: `${Math.round((process.memoryUsage().heapUsed / os.totalmem()) * 100)}%`,
          },
          cpu: {
            cores: os.cpus().length,
            load: os.loadavg()[0].toFixed(2),
          },
        },
        contracts: contractStats,
        timestamp: new Date().toISOString(),
      };

      res.json(status);
    } catch (error) {
      console.error("Error getting status:", error);
      res.status(500).json({ error: "Failed to get system status" });
    }
  });

  return httpServer;
}
