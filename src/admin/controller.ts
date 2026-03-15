import { IncomingMessage, ServerResponse } from "http";
import { AdminService } from "./service";

const adminService = new AdminService();

export function adminHandler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "";
  const method = req.method || "";

  // GET all admins
  if (url === "/api/admins" && method === "GET") {
    getAdmins(res);
  }

  // POST create admin
  else if (url === "/api/admins" && method === "POST") {
    createAdmin(req, res);
  }

  // DELETE admin
  else if (url.match(/^\/api\/admins\/\d+$/) && method === "DELETE") {
    deleteAdmin(url, res);
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

async function getAdmins(res: ServerResponse) {
  try {
    const admins = await adminService.getAllAdmins();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(admins));
  } catch {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Failed to fetch admins" }));
  }
}

function createAdmin(req: IncomingMessage, res: ServerResponse) {
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

      const admin = await adminService.createAdmin(name, email, password);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(admin));
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

async function deleteAdmin(url: string, res: ServerResponse) {
  try {
    const id = parseInt(url.split("/")[3], 10);
    if (Number.isNaN(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid admin id" }));
      return;
    }
    await adminService.deleteAdmin(id);
    res.writeHead(204);
    res.end();
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : null;
    if (code === "P2025") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Admin not found" }));
      return;
    }
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Failed to delete admin" }));
  }
}
