import prisma from "../prismaClient";

export class AuthService {
  async login(email: string, password: string) {
    return prisma.user.findFirst({
      where: { email, password },
    });
  }

  async adminLogin(email: string, password: string) {
    return prisma.admin.findFirst({
      where: { email, password },
    });
  }

  async signup(name: string, email: string, password: string) {
    return prisma.user.create({
      data: { name, email, password },
    });
  }
}
