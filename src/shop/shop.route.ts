import { Router } from "express";
import { orderController } from "./shop.controller";

const router: Router = Router();

// Define your order routes here
router.post("/", orderController.createShop);

export const shopRouter = { router };
