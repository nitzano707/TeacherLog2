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
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
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
            items: { type: Type.STRING },
            description: "3 strengths"
          },
          challenges: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2 challenges"
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 short suggestions"
          }
        },
        required: ["strengths", "challenges", "suggestions"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result as ReflectionAnalysis;
}
