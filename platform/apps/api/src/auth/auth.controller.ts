import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./auth.constants";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private cookieOpts(maxAgeMs: number) {
    return { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: maxAgeMs };
  }

  @Post("login")
  async login(@Body() body: { phone: string; password: string }, @Res({ passthrough: true }) res: Response) {
    const session = await this.auth.login(body.phone, body.password);
    res.cookie(ACCESS_COOKIE, session.accessToken, this.cookieOpts(15 * 60 * 1000));
    res.cookie(REFRESH_COOKIE, session.refreshToken, this.cookieOpts(14 * 24 * 60 * 60 * 1000));
    return { user: session.user };
  }

  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Body() body: { refreshToken?: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const raw = (req.cookies as Record<string, string>)?.[REFRESH_COOKIE] ?? body.refreshToken;
    if (!raw) throw new UnauthorizedException("No refresh token");
    const session = await this.auth.refresh(raw);
    res.cookie(ACCESS_COOKIE, session.accessToken, this.cookieOpts(15 * 60 * 1000));
    res.cookie(REFRESH_COOKIE, session.refreshToken, this.cookieOpts(14 * 24 * 60 * 60 * 1000));
    return { ok: true };
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = (req.cookies as Record<string, string>)?.[REFRESH_COOKIE];
    if (raw) await this.auth.revokeRefreshToken(raw);
    res.clearCookie(ACCESS_COOKIE, { path: "/" });
    res.clearCookie(REFRESH_COOKIE, { path: "/" });
    return { ok: true };
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  me(@Req() req: Request & { user: { userId: string } }) {
    return this.auth.getProfile(req.user.userId);
  }
}
