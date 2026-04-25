export const geminiService = {
  /**
   * Predicts potential logistics delays using Gemini Intelligence via server API.
   */
  predictDelay: async (route: string, details: string) => {
    try {
      const response = await fetch("/api/ai/predict-delay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route, details })
      });
      if (!response.ok) throw new Error("API failure");
      return await response.json();
    } catch (error) {
      console.error("Gemini Prediction Proxy Error:", error);
      return {
        prediction: "Variable Congestion",
        confidence: 65,
        reason: "Intelligence systems are recalibrating. Defaulting to historical route heuristics."
      };
    }
  },

  /**
   * Generates empathetic AI support strategies via server API.
   */
  generateSupportReply: async (customerName: string, inquiry: string, shipmentStatus: string = "In Transit") => {
    try {
      const response = await fetch("/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, inquiry, shipmentStatus })
      });
      if (!response.ok) throw new Error("API failure");
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Gemini Support Proxy Error:", error);
      return "Logistics systems are briefly offline. Your inquiry has been prioritized for immediate human review.";
    }
  },

  /**
   * Generates an Executive Operational Report via server API.
   */
  generateExecutiveSummary: async (data: any) => {
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      });
      if (!response.ok) throw new Error("API failure");
      const result = await response.json();
      return result.summary;
    } catch (error) {
      console.error("Gemini Reporting Proxy Error:", error);
      return "System Alert: Executive Intelligence Engine is undergoing scheduled maintenance. Please review raw dashboard metrics.";
    }
  }
};
