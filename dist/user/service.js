"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
class UserService {
    async getAllUsers() {
        return prismaClient_1.default.user.findMany();
    }
    async getUserById(id) {
        return prismaClient_1.default.user.findUnique({ where: { id } });
    }
    async createUser(name, email, password) {
        return prismaClient_1.default.user.create({ data: { name, email, password } });
    }
    async deleteUser(id) {
        return prismaClient_1.default.user.delete({ where: { id } });
    }
}
exports.UserService = UserService;
