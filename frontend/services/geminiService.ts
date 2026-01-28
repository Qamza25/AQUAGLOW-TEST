
import { GoogleGenAI } from "@google/genai";
import { CarDetails } from "../types";

export const getAIRecommendation = async (details: CarDetails): Promise<string> => {
  // Initialize Gemini API client using process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Refined prompt acknowledging dynamic pricing based on vehicle size and wash tiers
  const prompt = `
    A customer is looking for a car wash package for their vehicle:
    Vehicle: ${details.year} ${details.make} ${details.model}
    Body Type: ${details.type}
    Current Condition: ${details.condition}
    Requested Extras: ${details.extras.join(', ') || 'None'}
    
    We have three service tiers with pricing that varies by vehicle size (starting from Sedan prices):
    1. Eco Refresh (Starting at R100) - Efficient exterior wash.
    2. Aqua Glow Deluxe (Starting at R400) - Exterior + Interior deep refresh.
    3. Executive Detail (Starting at R950) - Showroom-level restoration and protection.

    Provide a friendly, professional 2-3 sentence recommendation explaining WHY a specific tier is best for their ${details.year} ${details.make} ${details.model}. 
    Acknowledge the vehicle size (e.g. if it's a SUV or Truck) and the contamination level.
    Mention the car's specific model or make in the response to make it feel personalized.
    Focus on preserving the vehicle's aesthetic value.
    Do not mention the exact final price in your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text || "Based on your car's specific dimensions and condition, we recommend our Deluxe protocol for a balanced and thorough preservation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Aqua Glow Deluxe package is our most balanced choice and would suit your vehicle perfectly.";
  }
};
