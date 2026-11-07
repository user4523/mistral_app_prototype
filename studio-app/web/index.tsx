import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/")({
  component: ChatPage,
});

function ChatPage() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setError(null);
    const messages = [...history, { role: "user" as const, content: text }];
    setHistory(messages);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Unbekannter Fehler");
      setHistory([...messages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.25rem" }}>Mistral Chat (mistral-small-latest)</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1rem 0" }}>
        {history.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.75rem",
              background: m.role === "user" ? "#ffe9c7" : "#f0f0f0",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
        {error && <div style={{ color: "#b00020" }}>Fehler: {error}</div>}
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nachricht eingeben …"
          required
          style={{ flex: 1, padding: "0.6rem 0.75rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{ padding: "0.6rem 1rem", border: "none", borderRadius: "0.5rem", background: "#ff8500", color: "#fff", fontSize: "1rem" }}
        >
          Senden
        </button>
      </form>
    </main>
  );
}
