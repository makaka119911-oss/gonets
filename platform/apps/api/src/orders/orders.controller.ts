import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OrdersService } from "./orders.service";

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
  list() {
    return this.ordersService.list();
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  get(@Param("id") id: string) {
    return this.ordersService.get(id);
  }
}
