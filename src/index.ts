import "dotenv/config";
import { createServer } from "http";
import { userHandler } from "./user/controller";
import { authHandler } from "./auth";

const PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 7474;
const FRONTEND_URIS = (process.env.FRONTEND_URI || "http://localhost:3000")
  .split(",")
  .map((u) => u.trim().replace(/\/$/, ""));

function setCorsHeaders(req: { headers: { origin?: string } }, res: { setHeader: (n: string, v: string) => void }) {
  const origin = req.headers.origin;
  const allowed = origin && FRONTEND_URIS.some((u) => origin === u || (u.startsWith("http://localhost") && origin.startsWith("http://localhost")));
  res.setHeader("Access-Control-Allow-Origin", allowed ? origin! : FRONTEND_URIS[0]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
}

const server = createServer((req, res) => {
  const rawUrl = req.url || "";
  const url = rawUrl.split("?")[0];

  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (url.includes("login") || url.includes("signup")) {
      authHandler(req, res);
      return;
    }

    if (url.startsWith("/api/users")) {
      userHandler(req, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  } catch {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Something went wrong" }));
    }
  }
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT} | CORS: ${FRONTEND_URIS.join(", ")}`)
);