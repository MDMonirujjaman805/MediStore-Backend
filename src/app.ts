import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! This is MediStore Website.");
});

// Fallback 404 (Express 5 safe)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
