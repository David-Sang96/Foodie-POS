"use server";
import { prisma } from "@/libs/prisma";

import { Orders, ORDERSTATUS, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CreateCartOrderType {
  menuId: number;
  addonIds: number[];
  quantity: number;
  tableId: number;
  orderId?: number;
}

type OrderWithOrderAddonsAndMenus = Prisma.OrdersGetPayload<{
  include: { orderAddons: true; menus: true };
}>;

export const createOrUpdateCartOrder = async (payload: CreateCartOrderType) => {
  const { menuId, addonIds, quantity, tableId, orderId } = payload;

  let order: Orders;

  if (orderId) {
    const orderAddons = await prisma.orderAddons.findMany({
      where: { orderId },
    });
    if (orderAddons.length) {
      await prisma.orderAddons.deleteMany({ where: { orderId } });
    }
    order = await prisma.orders.update({
      where: { id: orderId },
      data: { quantity },
    });
  } else {
    order = await prisma.orders.create({
      data: { menuId, quantity, tableId },
    });
  }

  if (addonIds.length) {
    for (const addonId of addonIds) {
      await prisma.orderAddons.create({
        data: { orderId: order.id, addonId },
      });
    }
  }
  redirect(`/order?tableId=${tableId}`);
};

export async function getCardTotalPrice(tableId: number, status?: ORDERSTATUS) {
  let cartOrders: OrderWithOrderAddonsAndMenus[] = [];

  if (status) {
    cartOrders = await prisma.orders.findMany({
      where: { tableId, status },
      include: { orderAddons: true, menus: true },
    });
  } else {
    cartOrders = await prisma.orders.findMany({
      where: { tableId },
      include: { orderAddons: true, menus: true },
    });
  }

  let totalPrice = 0;
  for (const cartOrder of cartOrders) {
    // Get menu total price
    totalPrice += (cartOrder.menus.price || 0) * cartOrder.quantity;

    // Get addon total price
    const addonIds = cartOrder.orderAddons.map((item) => item.addonId);
    const totalAddonPrice = (
      await prisma.addons.findMany({ where: { id: { in: addonIds } } })
    )?.reduce((acc, cur) => acc + cur.price, 0);
    totalPrice += totalAddonPrice * cartOrder.quantity;

    // Process addons
    // const orderAddons = cartOrder.orderAddons;
    // for (const orderAddon of orderAddons) {
    //   const addonId = orderAddon.addonId;
    //   const addon = await prisma.addons.findFirst({ where: { id: addonId } });
    //   if (addon) {
    //     totalPrice += addon.price;
    //   }
    // }
  }
  return totalPrice;
}

export async function deleteCartOrder(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  const orderAddons = await prisma.orderAddons.findMany({
    where: { orderId: id },
  });
  if (orderAddons.length) {
    await prisma.orderAddons.deleteMany({ where: { orderId: id } });
  }
  await prisma.orders.delete({ where: { id } });

  revalidatePath("/order/cart");
}

export async function confirmOrder(formData: FormData) {
  const tableId = Number(formData.get("tableId"));
  if (!tableId) return;

  const orders = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
  });

  for (const order of orders) {
    await prisma.orders.update({
      where: { id: order.id },
      data: { status: ORDERSTATUS.PENDING },
    });
  }

  revalidatePath("/order/cart");
  redirect(`/order/active-order?tableId=${tableId}`);
}
