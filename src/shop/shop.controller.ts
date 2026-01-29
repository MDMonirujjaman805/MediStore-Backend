import { Request, Response } from "express";
import { orderService } from "./shop.service";

const createShop = async (req: Request, res: Response) => {
  try {
    const result = await orderService.createShop(req.body);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const orderController = {
  createShop,
};
