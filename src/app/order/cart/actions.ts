"use server";

import { ORDERSTATUS } from "@prisma/client";
import { redirect } from "next/navigation";

interface CreateCartOrderType {
  menuId: number;
  addonIds: number[];
  quantity: number;
  tableId: number;
}

export const createCartOrder = async (payload: CreateCartOrderType) => {
  const { menuId, addonIds, quantity, tableId } = payload;
  const order = await prisma.orders.create({
    data: { menuId, quantity, tableId },
  });
  if (addonIds.length) {
    for (const addonId of addonIds) {
      await prisma.orderAddons.create({
        data: { orderId: order.id, addonId },
      });
    }
  }
  redirect(`/order/cart?tableId=${tableId}`);
};

export async function getCardTotalPrice(tableId: number) {
  const cartOrders = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
    include: { orderAddons: true, menus: true },
  });
  let totalPrice = 0;
  for (const cartOrder of cartOrders) {
    // Add menu price * quantity
    totalPrice += (cartOrder.menus.price || 0) * cartOrder.quantity;

    // Process addons
    const orderAddons = cartOrder.orderAddons;
    for (const orderAddon of orderAddons) {
      const addonId = orderAddon.addonId;
      const addon = await prisma.addons.findFirst({ where: { id: addonId } });
      if (addon) {
        totalPrice += addon.price;
      }
    }
  }
  return totalPrice;
}
