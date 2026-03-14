import { IncomingMessage, ServerResponse } from "http";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export function chatbotHandler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "";
  const method = req.method || "";

  if (url === "/api/chatbot" && method === "POST") {
    handleChat(req, res);
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
}

function handleChat(req: IncomingMessage, res: ServerResponse) {
  let body = "";

  req.on("data", (chunk) => (body += chunk));

  req.on("end", async () => {
    try {
      const data = body ? JSON.parse(body) : {};
      const message = data.message ?? "";

      if (!GEMINI_API_KEY) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Gemini API key not configured. Add GEMINI_API_KEY to .env" }));
        return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `You are a helpful coding assistant. Reply to the user.\n\nUser: ${message}` }],
              },
            ],
          }),
        }
      );

      const json = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        error?: { message?: string };
      };

      if (!response.ok) {
        res.writeHead(response.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: json.error?.message || "Gemini request failed" }));
        return;
      }

      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ reply }));
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Something went wrong" }));
    }
  });
}
