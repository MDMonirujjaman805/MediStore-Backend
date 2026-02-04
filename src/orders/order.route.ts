import { Router } from "express";
import { orderController } from "./order.controller";
import authMiddleware, { AuthRole } from "../middleware/auth";

const router: Router = Router();
// console.log(router);

router.get("/", orderController.getAllOrders);

// Define your order routes here
router.post("/", await authMiddleware(AuthRole.SELLER, AuthRole.CUSTOMER),orderController.createOrder);




export const orderRouter = { router };
