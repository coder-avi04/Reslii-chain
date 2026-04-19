import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Simulated Email Dispatch API
  app.post("/api/send-support-email", (req, res) => {
    const { to, subject, body } = req.body;
    console.log(`[MAILER] Sending email to: ${to}`);
    console.log(`[MAILER] Subject: ${subject}`);
    console.log(`[MAILER] Body: ${body.substring(0, 100)}...`);
    
    // Simulate network delay
    setTimeout(() => {
      res.json({ success: true, messageId: "MSG-" + Math.random().toString(36).substr(2, 6).toUpperCase() });
    }, 1000);
  });

  // Simulated Route Optimization Algorithm (representing the "C++ Backend")
  app.post("/api/optimize-route", (req, res) => {
    const { origin, destination, constraints } = req.body;
    
    console.log(`Optimizing route from ${origin} to ${destination}...`);
    
    // Simulate complex calculation
    const delay = Math.random() < 0.3 ? (Math.random() * 10).toFixed(1) : "0";
    const distance = Math.floor(Math.random() * 5000) + 1000;
    const duration = Math.floor(distance / 80) + (parseFloat(delay as string) || 0);
    
    const optimizedPath = [
      { city: origin, status: "Departed" },
      { city: "Intermediate Hub " + (Math.floor(Math.random() * 100)), status: "Routed" },
      { city: destination, status: "Projected" }
    ];

    res.json({
      id: "OPT-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      origin,
      destination,
      optimizedPath,
      stats: {
        distance: `${distance} km`,
        duration: `${duration} hours`,
        estimatedDelay: `${delay} hours`,
        confidence: "94.2%"
      },
      recommendation: "Avoid trans-Pacific corridor due to predicted high-altitude turbulence."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
