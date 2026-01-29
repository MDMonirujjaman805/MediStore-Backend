import cors from "cors";
import { auth } from "./lib/auth";
import express, { Application } from "express";
import { shopRouter } from "./shop/shop.route";
import { toNodeHandler } from "better-auth/node";
import { orderRouter } from "./orders/order.route";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/v1/orders", orderRouter.router);
app.use("/api/v1/shop", shopRouter.router);

app.get("/", (req, res) => {
  res.send("Hello World! This is MediStore Website.");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
