
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestionResponse, Language } from "../types";

// Safely access process.env to avoid crashes in browser environments (Vite, etc.)
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const generateWatermarkSuggestions = async (base64Image: string, language: Language): Promise<string[]> => {
  const fallback = language === 'zh' 
    ? ["© 版权所有", "原创作品", "严禁复制", "水印", "仅供参考"]
    : ["© Copyright 2024", "Protected", "Do Not Copy", "Watermark", "Private"];

  if (!apiKey) {
    console.warn("API Key is missing. Returning default suggestions.");
    return fallback;
  }

  // Remove data URL prefix if present to get raw base64
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  const langInstruction = language === 'zh' 
    ? "Generate suggestions in Simplified Chinese (简体中文). Keep them concise (2-6 characters)." 
    : "Generate suggestions in English. Keep them under 5 words.";

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
            text: `Analyze this image and suggest 5 short, professional, or creative watermark texts. They could be witty captions, copyright tags, or brand-like names suitable for this specific photo. ${langInstruction}`,
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
    if (!jsonText) return fallback;
    
    const parsed = JSON.parse(jsonText) as SuggestionResponse;
    return parsed.suggestions || [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallback;
  }
};
