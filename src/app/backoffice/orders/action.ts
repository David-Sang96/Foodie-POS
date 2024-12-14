"use server";

import { ORDERSTATUS } from "@prisma/client";

export async function getTotalPriceByOrderId(orderId: number) {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: { orderAddons: true, menus: true },
  });

  if (!order) return 0;

  const addonIds = order?.orderAddons.map((item) => item.addonId);
  const addons = await prisma.addons.findMany({
    where: { id: { in: addonIds } },
  });

  let totalPrice = order.menus.price || 0;
  if (addons.length) {
    for (const addon of addons) {
      totalPrice += addon.price;
    }
  }
  return totalPrice * order.quantity;
}

export async function updateOrderStatus(orderId: number, status: ORDERSTATUS) {
  await prisma.orders.update({ where: { id: orderId }, data: { status } });
}
