import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { note, question } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Corrected
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are an AI assistant helping the user discuss their note.

Note content:
"${note}"

User's question:
"${question}"

Please reply helpfully and clearly.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return new Response(JSON.stringify({ answer: response }), { status: 200 });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(
      JSON.stringify({ error: "AI request failed." }),
      { status: 500 }
    );
  }
}
