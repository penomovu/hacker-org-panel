import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { User as SelectUser, clientRegisterSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many registration attempts. Please try again after an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

export function setupAuth(app: Express) {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set");
  }
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    name: "__Host-sid",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/client/register", registerLimiter, async (req, res, next) => {
    try {
      const parsed = clientRegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: fromZodError(parsed.error).message });
      }

      const { username, email, password } = parsed.data;

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        role: "client",
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/client/login", loginLimiter, (req, res, next) => {
    passport.authenticate("local", (err: any, user: SelectUser | false) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json({ 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        });
      });
    })(req, res, next);
  });

  app.post("/api/login", loginLimiter, (req, res, next) => {
    if (req.isAuthenticated()) {
      req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => {
          if (err) return next(err);
          res.clearCookie("__Host-sid");
          performAdminLogin(req, res, next);
        });
      });
    } else {
      performAdminLogin(req, res, next);
    }

    function performAdminLogin(req: any, res: any, next: any) {
      passport.authenticate("local", (err: any, user: SelectUser | false) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        if (user.role !== "admin") {
          return res.status(403).json({ error: "Access denied. Admin only." });
        }
        req.session.regenerate((err: any) => {
          if (err) return next(err);
          req.session.isAdminSession = true;
          req.login(user, (err: any) => {
            if (err) return next(err);
            res.status(200).json({ id: user.id, username: user.username, role: user.role });
          });
        });
      })(req, res, next);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("__Host-sid");
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json({ 
      id: req.user!.id, 
      username: req.user!.username, 
      email: req.user!.email,
      role: req.user!.role 
    });
  });
}

export { hashPassword };
