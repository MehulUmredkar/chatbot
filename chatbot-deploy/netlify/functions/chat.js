// Netlify function: POST /api/chat (redirected via netlify.toml)
const SYSTEM = "You are a friendly, knowledgeable assistant. Answer clearly and concisely. Use plain text; wrap code in triple backticks.";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const json = (statusCode, obj) => ({ statusCode, headers: { "content-type": "application/json" }, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json(500, { error: "Server is missing ANTHROPIC_API_KEY" });

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {}
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-30)
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 8000) }));
  if (!messages.length || messages[messages.length - 1].role !== "user")
    return json(400, { error: "Invalid messages" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, system: SYSTEM, messages })
    });
    const data = await r.json();
    if (!r.ok) return json(502, { error: (data.error && data.error.message) || "Upstream error" });
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    return json(200, { text });
  } catch (e) {
    return json(500, { error: "Could not reach the AI service" });
  }
};
