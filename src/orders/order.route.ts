import { Router } from "express";
import { orderController } from "./order.controller";

const router: Router = Router();

// Define your order routes here
router.post("/", orderController.createOrder);

export const orderRouter = { router };
