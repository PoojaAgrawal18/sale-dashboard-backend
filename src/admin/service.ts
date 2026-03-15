import prisma from "../prismaClient";

export class AdminService {
  async getAllAdmins() {
    return prisma.admin.findMany();
  }

  async getAdminById(id: number) {
    return prisma.admin.findUnique({ where: { id } });
  }

  async createAdmin(name: string, email: string, password: string) {
    return prisma.admin.create({ data: { name, email, password } });
  }

  async deleteAdmin(id: number) {
    return prisma.admin.delete({ where: { id } });
  }
}
