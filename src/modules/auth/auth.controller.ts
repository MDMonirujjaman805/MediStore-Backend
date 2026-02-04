import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const body = registerSchema.parse(req.body);
      const user = await AuthService.register(body);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const body = loginSchema.parse(req.body);
      const result = await AuthService.login(body);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  },
};
