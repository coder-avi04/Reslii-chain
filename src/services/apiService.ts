/**
 * ResiliChain Backend API Service
 * Centralizes all communication with the Express.js backend.
 */

export const apiService = {
  /**
   * Triggers the backend AI simulation for route delay prediction.
   */
  async predictDelay(route: string, details: string) {
    const res = await fetch("/api/ai/predict-delay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route, details }),
    });
    if (!res.ok) throw new Error("Backend AI prediction failed");
    return res.json();
  },

  /**
   * Generates a professional support reply using server-side Gemini.
   */
  async generateSupportReply(customerName: string, message: string, shipmentStatus: string) {
    const res = await fetch("/api/ai/generate-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName, message, shipmentStatus }),
    });
    if (!res.ok) throw new Error("Backend support generation failed");
    return res.json();
  },

  /**
   * Dispatches a simulated email via the backend mailer.
   */
  async sendEmail(to: string, subject: string, body: string) {
    const res = await fetch("/api/send-support-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, body }),
    });
    if (!res.ok) throw new Error("Email dispatch failed");
    return res.json();
  },

  /**
   * Triggers the backend C++ route optimization algorithm simulation.
   */
  async optimizeRoute(origin: string, destination: string) {
    const res = await fetch("/api/optimize-route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination }),
    });
    if (!res.ok) throw new Error("Route optimization failed");
    return res.json();
  },
};
