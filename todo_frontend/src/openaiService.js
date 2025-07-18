//
// openaiService.js
//
// Simple utility/service for interacting with OpenAI API from the React app
//
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

/**
 * PUBLIC_INTERFACE
 * Sends a prompt to the OpenAI API (GPT-3.5-turbo) and returns the reply.
 * @param {string} prompt - The input prompt/message to send to GPT.
 * @param {object} [opts] - Optional: { systemPrompt: string, maxTokens: number, temperature: number }
 * @returns {Promise<string>} - Returns a Promise that resolves to the reply string.
 */
export async function fetchOpenAICompletion(prompt, opts = {}) {
  /** Sends a prompt to OpenAI's chat completion endpoint and returns the reply message. */
  const apiKey = OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not set in environment variables");
  }
  const systemPrompt = opts.systemPrompt || "You are an AI assistant that gives short motivational quotes for productivity.";
  const max_tokens = opts.maxTokens || 64;
  const temperature = "temperature" in opts ? opts.temperature : 0.6;

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    max_tokens,
    temperature
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${message}`);
  }
  const json = await response.json();
  return json?.choices?.[0]?.message?.content || "";
}
