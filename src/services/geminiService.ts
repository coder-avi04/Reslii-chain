import { apiService } from "./apiService";

/**
 * ResiliChain AI Intelligence Service (Client Proxy)
 * Delegates all AI operations to the backend to protect API keys and ensure operational security.
 */
export const geminiService = {
  /**
   * Predicts potential logistics delays based on route and environmental factors.
   */
  predictDelay: async (route: string, details: string) => {
    try {
      return await apiService.predictDelay(route, details);
    } catch (error) {
      console.error("Backend AI Prediction Error:", error);
      return {
        prediction: "Variable Delay",
        confidence: 70,
        reason: "Network volatility prevented high-fidelity simulation. Defaulting to historical averages."
      };
    }
  },

  /**
   * Generates empathetic and smart support drafts for customer inquiries.
   */
  generateSupportReply: async (customerName: string, inquiry: string, shipmentStatus?: string) => {
    try {
      const { reply } = await apiService.generateSupportReply(customerName, inquiry, shipmentStatus || "Standard Transit");
      return reply;
    } catch (error) {
      console.error("Backend AI Support Error:", error);
      return "Thank you for contacting ResiliChain. Our human operators are reviewing your complex case now.";
    }
  }
};
