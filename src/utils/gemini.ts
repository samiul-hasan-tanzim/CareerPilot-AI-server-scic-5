import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      genAI = new GoogleGenerativeAI(apiKey);
    }
  }
  return genAI;
}

export async function generateWithGemini(
  systemPrompt: string,
  userMessage: string
): Promise<string | null> {
  const client = getClient();
  if (!client) {
    console.log("Gemini: no API key configured, skipping");
    return null;
  }

  try {
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}
