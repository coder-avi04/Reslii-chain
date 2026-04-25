import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini securely with direct process.env access
const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Prediction Route
  app.post("/api/ai/predict-delay", async (req, res) => {
    const { route, details } = req.body;
    try {
      const model = googleAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Analyze logistics route: ${route}. \nContext/Details: ${details}. \nProvide a prediction of delay, confidence level, and detailed reason in JSON format. Use fields: prediction, confidence (number), reason.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Basic JSON cleanup if needed
      text = text.replace(/```json|```/g, "").trim();
      
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("AI Delay Prediction Error:", error);
      res.status(500).json({ error: "Failed to generate prediction" });
    }
  });

  // AI Support Reply Route
  app.post("/api/ai/generate-reply", async (req, res) => {
    const { customerName, inquiry, shipmentStatus } = req.body;
    try {
      const model = googleAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate a professional, high-tech supply chain support response for customer "${customerName}". 
      They are asking about: "${inquiry}". 
      Current Shipment Status: "${shipmentStatus || "In Transit"}". 
      The tone should be "Resilient, technical yet empathetic, and reassuring".`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ reply: response.text() });
    } catch (error) {
      console.error("AI Support Error:", error);
      res.status(500).json({ error: "Failed to generate support reply" });
    }
  });

  // AI Executive Summary Route
  app.post("/api/ai/generate-summary", async (req, res) => {
    const { data } = req.body;
    try {
      const model = googleAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are the Lead Intelligence Officer at ResiliChain. 
      Generate a concise, high-impact Executive Operational Report based on the following data:
      ${JSON.stringify(data, null, 2)}
      
      The report should include:
      1. Operational Status Summary
      2. Critical Risk Assessment
      3. Strategic Recommendations
      4. Efficiency KPIs
      
      Keep it professional, data-driven, and technical.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ summary: response.text() });
    } catch (error) {
      console.error("AI Reporting Error:", error);
      res.status(500).json({ error: "Failed to generate executive summary" });
    }
  });

  // Simulated Email Dispatch API
  app.post("/api/send-support-email", (req, res) => {
    const { to, subject, body } = req.body;
    console.log(`[MAILER] Dispatching communication to: ${to}`);
    // Simulate real mail server delay
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
