import { createServer } from "http";
import prisma from "./prismaClient";

const PORT = 7474;

const server = createServer(async (req, res) => {
  if (req.url === "/api/users" && req.method === "GET") {
    const users = await prisma.user.findMany();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
