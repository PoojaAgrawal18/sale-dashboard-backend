"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const service_1 = require("./service");
const userService = new service_1.UserService();
class UserController {
    async handle(req, res) {
        const url = req.url || "";
        const method = req.method || "";
        if (url === "/api/users" && method === "GET") {
            const users = await userService.getAllUsers();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users));
        }
        else if (url.match(/^\/api\/users\/\d+$/) && method === "GET") {
            const id = parseInt(url.split("/")[3]);
            const user = await userService.getUserById(id);
            if (user) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(user));
            }
            else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "User not found" }));
            }
        }
        else if (url === "/api/users" && method === "POST") {
            let body = "";
            req.on("data", chunk => (body += chunk));
            req.on("end", async () => {
                const { name, email, password } = JSON.parse(body);
                const user = await userService.createUser(name, email, password);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify(user));
            });
        }
        else if (url.match(/^\/api\/users\/\d+$/) && method === "DELETE") {
            const id = parseInt(url.split("/")[3]);
            await userService.deleteUser(id);
            res.writeHead(204);
            res.end();
        }
        else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
        }
    }
}
exports.UserController = UserController;
