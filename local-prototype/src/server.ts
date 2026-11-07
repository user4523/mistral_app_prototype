import "dotenv/config";
import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Mistral } from "@mistralai/mistralai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3000);
const MODEL = "mistral-small-latest";

if (!process.env.MISTRAL_API_KEY) {
  console.error("MISTRAL_API_KEY fehlt. Bitte .env anlegen (siehe .env.example).");
  process.exit(1);
}

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/chat") {
      const body = (await readJsonBody(req)) as { messages?: ChatMessage[] };
      if (!Array.isArray(body.messages) || body.messages.length === 0) {
        sendJson(res, 400, { error: "messages fehlt oder ist leer" });
        return;
      }
      const completion = await client.chat.complete({
        model: MODEL,
        messages: body.messages,
      });
      const content = completion.choices?.[0]?.message?.content;
      const reply = typeof content === "string" ? content : JSON.stringify(content ?? "");
      sendJson(res, 200, { reply });
      return;
    }

    if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
      const html = await readFile(path.join(__dirname, "..", "public", "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Interner Serverfehler" });
  }
});

server.listen(PORT, () => {
  console.log(`Chat-App läuft auf http://localhost:${PORT} (Modell: ${MODEL})`);
});
