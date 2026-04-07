import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRole } from "@prisma/client";
import type { Request } from "express";
import { OrdersService } from "./orders.service";

type Authed = Request & { user: { userId: string; role: UserRole } };

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("calculate")
  calculate(
    @Body() body: { distance: number; weight: number; type: "walk" | "car" | "cargo"; urgency: "asap" | "plan" }
  ) {
    return this.ordersService.calculate(body);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  list(@Req() req: Authed) {
    return this.ordersService.listForUser(req.user.userId, req.user.role);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  get(@Param("id") id: string, @Req() req: Authed) {
    return this.ordersService.getForUser(id, req.user.userId, req.user.role);
  }
}
