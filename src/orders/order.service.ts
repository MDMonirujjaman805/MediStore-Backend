import { OrderStatus } from "./../../generated/prisma/enums";
import { Order } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { OrderWhereInput } from "../../generated/prisma/models";

const createOrder = async (
  data: Omit<Order, "id" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  const result = await prisma.order.create({
    data: {
      ...data,
      customerId: userId,
    },
  });
  return result;
};
const getAllOrders = async ({
  search,
  status,
}: {
  search: string | undefined;
  status: OrderStatus | undefined;
}) => {
  // const anyThing :OrderWhereInput = []
  // console.log(anyThing);
  // if(search){anyThing.push({
  //   OR: [
  //     {
  //       shippingAddress: {
  //         contains: search,
  //         mode: "insensitive",
  //       },
  //     },
  //     {
  //       id: { contains: search },
  //     },
  //     { paymentMethod: { contains: search } },
  //   ],
  // });}
  //    if (status) {
  //   anyThing.push({
  //        status,
  //      });
  //    }

  const orders = await prisma.order.findMany({
    // where:status?{}:{},
    where: search
      ? {
          OR: [
            {
              shippingAddress: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              id: { contains: search },
            },
            { paymentMethod: { contains: search } },
            
          ],
        }
      : {},

    // where: payload.search
    //   ? {
    //       OR: [
    //         { id: { contains: payload.search, mode: "insensitive" } },
    //         { customerId: { contains: payload.search, mode: "insensitive" } },
    //         {
    //           shippingAddress: {
    //             contains: payload.search,
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     }
    //   : {},

    // where: {
    //   status: {
    //     status: PENDING,
    //   },
    // },

    // where: payload.search
    //   ? {
    //       AND: [
    //         { id: { contains: payload.search } },
    //         { customerId: { contains: payload.search } },
    //         { shippingAddress: { contains: payload.search } },
    //       ],
    //     }
    //   : {},
  });

  return orders;
};

export const orderService = {
  createOrder,
  getAllOrders,
};

// payload: {
//   search?: string | undefined;
//   status?: OrderStatus;
// }
