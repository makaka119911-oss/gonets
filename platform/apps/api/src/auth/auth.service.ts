import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async login(phone: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() }
    });
    return this.issueSession(user);
  }

  async refresh(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    const row = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });
    if (!row || row.revokedAt || row.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    await this.prisma.refreshToken.update({ where: { id: row.id }, data: { revokedAt: new Date() } });
    return this.issueSession(row.user);
  }

  async revokeRefreshToken(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, phone: user.phone, name: user.name, role: user.role.toLowerCase() };
  }

  private async issueSession(user: { id: string; name: string; phone: string; role: string }) {
    const rawRefresh = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawRefresh);
    const days = Number(this.config.get("REFRESH_TOKEN_DAYS") ?? 14);
    const expiresAt = new Date(Date.now() + days * 86400000);
    await this.prisma.refreshToken.create({
      data: { tokenHash, userId: user.id, expiresAt }
    });
    const accessToken = this.jwt.sign(
      { sub: user.id, role: user.role },
      { expiresIn: this.config.get("ACCESS_TOKEN_TTL") ?? "15m" }
    );
    return {
      accessToken,
      refreshToken: rawRefresh,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role.toLowerCase() }
    };
  }

  private hashToken(raw: string) {
    return createHash("sha256").update(raw).digest("hex");
  }
}
