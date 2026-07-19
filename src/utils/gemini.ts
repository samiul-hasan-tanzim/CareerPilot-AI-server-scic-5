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

export async function* generateWithGeminiStream(
  systemPrompt: string,
  userMessage: string
): AsyncGenerator<string | null> {
  const client = getClient();
  if (!client) {
    console.log("Gemini: no API key configured, skipping");
    yield null;
    return;
  }

  try {
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContentStream(userMessage);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (error) {
    console.error("Gemini streaming error:", error);
    yield null;
  }
}
