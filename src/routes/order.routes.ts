// src/routes/order.routes.ts

import express from "express";
// import { PrismaClient } from "@prisma/client";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";

const router = express.Router();
// const prisma = new PrismaClient();

// Create order (Customer only)
router.post("/", authenticate, authorize("CUSTOMER"), async (req, res) => {
  try {
    const { items, addressId, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Verify address belongs to user
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== req.user!.userId) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Verify stock and calculate total
    let totalAmount = 0;
    for (const item of items) {
      const medicine = await prisma.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!medicine || !medicine.isActive) {
        return res.status(400).json({
          success: false,
          message: `Medicine ${item.medicineId} is not available`,
        });
      }

      if (medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}`,
        });
      }

      totalAmount += medicine.price * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: req.user!.userId,
        addressId,
        totalAmount,
        notes,
        items: {
          create: items.map((item: any) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
        address: true,
      },
    });

    // Update medicine stock
    for (const item of items) {
      await prisma.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get user orders (Customer)
router.get(
  "/my-orders",
  authenticate,
  authorize("CUSTOMER"),
  async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: { customerId: req.user!.userId },
        include: {
          items: {
            include: {
              medicine: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          address: true,
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Get order by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            medicine: {
              include: {
                seller: {
                  select: { name: true, phone: true },
                },
              },
            },
          },
        },
        address: true,
        customer: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check permissions
    const isCustomer = order.customerId === req.user!.userId;
    const isSeller = order.items.some(
      (item) => item.medicine.sellerId === req.user!.userId,
    );
    const isAdmin = req.user!.role === "ADMIN";

    if (!isCustomer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get seller orders (Seller)
router.get(
  "/seller/orders",
  authenticate,
  authorize("SELLER"),
  async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              medicine: {
                sellerId: req.user!.userId,
              },
            },
          },
        },
        include: {
          items: {
            where: {
              medicine: {
                sellerId: req.user!.userId,
              },
            },
            include: {
              medicine: true,
            },
          },
          address: true,
          customer: {
            select: { name: true, phone: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Update order status (Seller/Admin)
router.patch(
  "/:id/status",
  authenticate,
  authorize("SELLER", "ADMIN"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
          items: {
            include: {
              medicine: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if seller owns items in order
      if (req.user!.role === "SELLER") {
        const hasSellersItems = order.items.some(
          (item) => item.medicine.sellerId === req.user!.userId,
        );
        if (!hasSellersItems) {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }
      }

      const updated = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
      });

      res.json({
        success: true,
        message: "Order status updated",
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

// Get all orders (Admin)
router.get("/", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            medicine: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
