// src/routes/medicine.routes.ts

import express from "express";
// import { PrismaClient } from "@prisma/client";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { body, validationResult } from "express-validator";
import { prisma } from "../lib/prisma";

const router = express.Router();
// const prisma = new PrismaClient();

// Get all medicines (Public)
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { manufacturer: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categoryId = category as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: { name: true, id: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.medicine.count({ where }),
    ]);

    // Calculate average rating
    const medicinesWithRating = medicines.map((medicine) => {
      const avgRating =
        medicine.reviews.length > 0
          ? medicine.reviews.reduce((sum, r) => sum + r.rating, 0) /
            medicine.reviews.length
          : 0;
      return {
        ...medicine,
        averageRating: avgRating,
        reviewCount: medicine.reviews.length,
        reviews: undefined, // Remove reviews array
      };
    });

    res.json({
      success: true,
      data: {
        medicines: medicinesWithRating,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get medicine by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        seller: {
          select: { name: true, id: true, phone: true },
        },
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const avgRating =
      medicine.reviews.length > 0
        ? medicine.reviews.reduce((sum, r) => sum + r.rating, 0) /
          medicine.reviews.length
        : 0;

    res.json({
      success: true,
      data: {
        ...medicine,
        averageRating: avgRating,
        reviewCount: medicine.reviews.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create medicine (Seller only)
router.post(
  "/",
  authenticate,
  authorize("SELLER", "ADMIN"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
    body("stock").isInt({ min: 0 }).withMessage("Valid stock is required"),
    body("manufacturer").notEmpty().withMessage("Manufacturer is required"),
    body("categoryId").notEmpty().withMessage("Category is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const medicine = await prisma.medicine.create({
        data: {
          ...req.body,
          sellerId: req.user!.userId,
        },
        include: {
          category: true,
          seller: {
            select: { name: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "Medicine created successfully",
        data: medicine,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Update medicine (Seller/Admin only)
router.put(
  "/:id",
  authenticate,
  authorize("SELLER", "ADMIN"),
  async (req, res) => {
    try {
      const medicine = await prisma.medicine.findUnique({
        where: { id: req.params.id },
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found",
        });
      }

      // Check if user owns this medicine (unless admin)
      if (
        req.user!.role !== "ADMIN" &&
        medicine.sellerId !== req.user!.userId
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own medicines",
        });
      }

      const updated = await prisma.medicine.update({
        where: { id: req.params.id },
        data: req.body,
        include: {
          category: true,
          seller: {
            select: { name: true },
          },
        },
      });

      res.json({
        success: true,
        message: "Medicine updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Delete medicine (Seller/Admin only)
router.delete(
  "/:id",
  authenticate,
  authorize("SELLER", "ADMIN"),
  async (req, res) => {
    try {
      const medicine = await prisma.medicine.findUnique({
        where: { id: req.params.id },
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found",
        });
      }

      if (
        req.user!.role !== "ADMIN" &&
        medicine.sellerId !== req.user!.userId
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own medicines",
        });
      }

      await prisma.medicine.delete({
        where: { id: req.params.id },
      });

      res.json({
        success: true,
        message: "Medicine deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

export default router;
