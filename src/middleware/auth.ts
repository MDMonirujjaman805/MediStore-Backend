import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma"; // 👈 prisma import করো

export enum AuthRole {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: AuthRole;
        emailVerified: boolean;
      };
    }
  }
}

const authMiddleware = async (...roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!session.user.emailVerified) {
        return res.status(401).json({
          message: "Email verification required, Please verify your Email.",
        });
      }

      // 🔥 REAL USER FROM DB
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
        },
      });

      if (!dbUser) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach to req
      req.user = {
        id: dbUser.id,
        email: dbUser.email!,
        name: dbUser.name,
        role: dbUser.role as AuthRole,
        emailVerified: dbUser.emailVerified,
      };

      // Authorization
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Forbidden! You don't have permission to access this resource.",
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
export default authMiddleware;

// const authMiddleware = async (...roles: AuthRole[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Authentication logic goes here
//       const session = await betterAuth.api.getSession({
//         headers: req.headers as any,
//       });
//       if (!session) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       if (!session.user.emailVerified) {
//         return res.status(401).json({
//           message: "Email verification required, Please verify your Email.",
//         });
//       }
//       // Attach user info to request object
//       req.user = {
//         id: session.user.id,
//         email: session.user.email!,
//         name: session.user.name || "",
//         role: session.user.role as AuthRole,
//         emailVerified: session.user.emailVerified!,
//       };

//       // Authorization logic
//       if (roles.length && !roles.includes(req.user.role as AuthRole)) {
//         return res.status(403).json({
//           message:
//             "Forbidden! You don't have permission to access this resources.",
//         });
//       }

//       next();
//     } catch (error) {
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   };
// };

// export default authMiddleware;

// const { verifyToken } = require("../utils/jwt");
// // const prisma = require("../utils/prisma");

// const authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ error: { message: "Authentication required" } });
//     }

//     const decoded = verifyToken(token);

//     if (!decoded) {
//       return res
//         .status(401)
//         .json({ error: { message: "Invalid or expired token" } });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         role: true,
//         isActive: true,
//       },
//     });

//     if (!user || !user.isActive) {
//       return res
//         .status(401)
//         .json({ error: { message: "User not found or inactive" } });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: { message: "Authentication failed" } });
//   }
// };

// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res
//         .status(401)
//         .json({ error: { message: "Authentication required" } });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res
//         .status(403)
//         .json({ error: { message: "Insufficient permissions" } });
//     }

//     next();
//   };
// };

// module.exports = {
//   authenticate,
//   authorize,
// };
