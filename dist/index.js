"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const prismaClient_1 = __importDefault(require("./prismaClient"));
const PORT = 7474;
const server = (0, http_1.createServer)(async (req, res) => {
    if (req.url === "/api/users" && req.method === "GET") {
        const users = await prismaClient_1.default.user.findMany();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
