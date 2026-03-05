import { IncomingMessage, ServerResponse } from "http";
import { UserService } from "./service";

const userService = new UserService();

export function userHandler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "";
  const method = req.method || "";

  // GET all users
  if (url === "/api/users" && method === "GET") {
    getUsers(res);
  }

  // POST create user
  else if (url === "/api/users" && method === "POST") {
    createUser(req, res);
  }

  // DELETE user
  else if (url.match(/^\/api\/users\/\d+$/) && method === "DELETE") {
    deleteUser(url, res);
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

async function getUsers(res: ServerResponse) {
  try {
    const users = await userService.getAllUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Failed to fetch users" }));
  }
}

function createUser(req: IncomingMessage, res: ServerResponse) {
  let body = "";

  req.on("data", chunk => body += chunk);

  req.on("end", async () => {
    try {
      const data = body ? JSON.parse(body) : {};
      const { name, email, password } = data;

      if (!name || !email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Name, email and password are required" }));
        return;
      }

      const user = await userService.createUser(name, email, password);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : null;
      if (code === "P2002") {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Email already in use" }));
        return;
      }
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
}

async function deleteUser(url: string, res: ServerResponse) {
  try {
    const id = parseInt(url.split("/")[3], 10);
    if (Number.isNaN(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid user id" }));
      return;
    }
    await userService.deleteUser(id);
    res.writeHead(204);
    res.end();
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : null;
    if (code === "P2025") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
      return;
    }
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Failed to delete user" }));
  }
}