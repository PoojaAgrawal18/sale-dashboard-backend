import prisma from "../prismaClient";

export class UserService {
  async getAllUsers() {
    return prisma.user.findMany();
  }

  async getUserById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(name: string, email: string, password: string) {
    return prisma.user.create({ data: { name, email, password } });
  }

  async deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}
