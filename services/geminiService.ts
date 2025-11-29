import { GoogleGenAI, Type } from "@google/genai";
import { SuggestionResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateWatermarkSuggestions = async (base64Image: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning default suggestions.");
    return ["© Copyright 2024", "Protected", "Do Not Copy"];
  }

  // Remove data URL prefix if present to get raw base64
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", // Assuming PNG for canvas export, or detect from source
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this image and suggest 5 short, professional, or creative watermark texts. They could be witty captions, copyright tags, or brand-like names suitable for this specific photo. Keep them under 5 words.",
          },
        ],
      },
      config: {
        systemInstruction: "You are a creative branding assistant. Return only a JSON object with a list of strings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return ["© Copyright", "Original Content"];
    
    const parsed = JSON.parse(jsonText) as SuggestionResponse;
    return parsed.suggestions || [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["© Copyright", "Draft", "Confidential", "Original Work"];
  }
};