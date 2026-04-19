import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const geminiService = {
  predictDelay: async (route: string, details: string) => {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using mock prediction.");
      return {
        prediction: "2.5h Delay",
        confidence: 85,
        reason: "Simulated prediction due to missing API key."
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      You are a logistics AI. Analyze the following route and details to predict a delay.
      Route: ${route}
      Details: ${details}
      
      Respond in JSON format:
      {
        "prediction": "string (e.g. 4h Delay or No Delay)",
        "confidence": number (1-100),
        "reason": "short explanation"
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Prediction Error:", error);
      throw error;
    }
  },

  generateSupportReply: async (customerName: string, inquiry: string, shipmentStatus?: string) => {
    if (!apiKey) {
      return "Dear " + customerName + ",\n\nWe have received your inquiry regarding " + inquiry + ". Our team is looking into it.\n\nBest regards,\nResiliChain Support";
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      You are a professional customer support agent for "ResiliChain", an AI-driven logistics company.
      Customer: ${customerName}
      Inquiry: ${inquiry}
      ${shipmentStatus ? `Current Shipment Status: ${shipmentStatus}` : ""}

      Generate a professional, empathetic, and helpful email reply. 
      If a shipment is delayed, explain that we are using AI to optimize the route and minimize the impact.
      
      Keep the tone concise and extremely professional.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      return response.text;
    } catch (error) {
      console.error("Gemini Support Error:", error);
      return "Error generating automated reply. Please draft manually.";
    }
  }
};
