import { IncomingMessage, ServerResponse } from "http";
import { AuthService } from "./service";

const authService = new AuthService();

export function authHandler(req: IncomingMessage, res: ServerResponse) {
  const rawUrl = req.url || "";
  const url = rawUrl.split("?")[0];
  const method = req.method || "";

  // Support /api/login, /login, /auth/login, /api/auth/login, with or without trailing slash
  if (url.endsWith("/login") && method === "POST") {
    login(req, res);
    return;
  }

  // Support /api/signup, /signup, /auth/signup, /api/auth/signup, with or without trailing slash
  if (url.endsWith("/signup") && method === "POST") {
    signup(req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not Found" }));
}

function login(req: IncomingMessage, res: ServerResponse) {
  let body = "";

  req.on("data", (chunk) => (body += chunk));

  req.on("end", async () => {
    try {
      const data = body ? JSON.parse(body) : {};
      const { email, password } = data;

      if (!email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Email and password are required" }));
        return;
      }

      const user = await authService.login(email, password);

      if (!user) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid email or password" }));
        return;
      }

      const base = (process.env.FRONTEND_URI || "http://localhost:3000").split(",")[0].trim().replace(/\/$/, "");
      const path = (process.env.LOGIN_REDIRECT_PATH || "/dashboard").replace(/^\//, "");
      const redirectTo = `${base}/${path}`;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          user,
          redirectTo,
        })
      );
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid request body" }));
        return;
      }
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Something went wrong" }));
    }
  });
}

function signup(req: IncomingMessage, res: ServerResponse) {
  let body = "";

  req.on("data", (chunk) => (body += chunk));

  req.on("end", async () => {
    try {
      const data = body ? JSON.parse(body) : {};
      const { name, email, password } = data;

      if (!name || !email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Name, email and password are required" }));
        return;
      }

      const user = await authService.signup(name, email, password);

      const base = (process.env.FRONTEND_URI || "http://localhost:3000").split(",")[0].trim().replace(/\/$/, "");
      const path = (process.env.LOGIN_REDIRECT_PATH || "/dashboard").replace(/^\//, "");
      const redirectTo = `${base}/${path}`;

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          user,
          redirectTo,
        })
      );
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : null;
      if (code === "P2002") {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Email already in use" }));
        return;
      }

      if (err instanceof SyntaxError) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid request body" }));
        return;
      }

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Something went wrong" }));
    }
  });
}
