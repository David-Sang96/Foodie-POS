"use server";

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
    data: { menuId, quantity, tableId, totalPrice: 0 },
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
