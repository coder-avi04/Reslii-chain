import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface PredictionResult {
  delayProbability: number;
  estimatedDelayHours: number;
  reason: string;
  confidenceScore: number;
  mitigationStrategy: string;
}

export async function predictShipmentDelay(shipmentData: any): Promise<PredictionResult> {
  if (!process.env.GEMINI_API_KEY) {
    // Mock response if key is missing (fallback for development without key)
    return {
      delayProbability: 0.15,
      estimatedDelayHours: 2,
      reason: "Historical data suggests possible congestion at destination port.",
      confidenceScore: 0.85,
      mitigationStrategy: "Maintain current heading but prepare for potential 2-hour queue."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a logistics AI. Analyze the following shipment data and predict potential delays:
      Shipment: ${JSON.stringify(shipmentData)}
      
      Return a JSON object with:
      - delayProbability (0-1)
      - estimatedDelayHours (number)
      - reason (string, specific and technical)
      - confidenceScore (0-1)
      - mitigationStrategy (string, actionable advice)
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as PredictionResult;
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return {
      delayProbability: 0,
      estimatedDelayHours: 0,
      reason: "Prediction engine unavailable",
      confidenceScore: 0,
      mitigationStrategy: "Contact system administrator"
    };
  }
}
