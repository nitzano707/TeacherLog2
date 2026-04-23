import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

console.log("VITE_GEMINI_API_KEY =", apiKey);

if (!apiKey) {
  throw new Error("Missing VITE_GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ apiKey });

export interface ReflectionAnalysis {
  strengths: string[];
  challenges: string[];
  suggestions: string[];
}

export async function analyzeReflection(text: string): Promise<ReflectionAnalysis> {
  console.log("🚀 Starting analysis...");
  console.log("📝 Input text:", text);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `נתח את הרפלקציה הבאה של מורה על שיעור.
החזר תוצאה במבנה JSON עם השדות הבאים בעברית:
- strengths: רשימה של 3 נקודות חוזק בשיעור.
- challenges: רשימה של 2 אתגרים שעלו מהשיעור.
- suggestions: רשימה של 3 הצעות קצרות לשיפור.

הרפלקציה:
${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            challenges: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["strengths", "challenges", "suggestions"]
        }
      }
    });

    console.log("📦 Full response object:", response);
    console.log("📄 response.text:", response.text);

    if (!response.text) {
      console.warn("⚠️ response.text is empty");
      throw new Error("Empty response from Gemini");
    }

    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (parseError) {
      console.error("❌ JSON parse failed:", response.text);
      throw parseError;
    }

    console.log("✅ Parsed result:", parsed);

    return parsed as ReflectionAnalysis;

  } catch (error) {
    console.error("🔥 Gemini error:", error);
    throw error;
  }
}
