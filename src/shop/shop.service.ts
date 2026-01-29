import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const createShop = async (data: Prisma.OrderCreateInput) => {
  const result = await prisma.order.create({
    data,
  });
  return result;
};

export const orderService = {
  createShop,
};
