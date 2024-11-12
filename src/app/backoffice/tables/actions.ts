"use server";

import { config } from "@/config";
import { getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import type { Tables } from "@prisma/client";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

export async function getTables() {
  const selectedLocationId = (await getSelectedLocation())?.locationId;
  return await prisma.tables.findMany({
    where: { locationId: selectedLocationId },
    orderBy: { id: "asc" },
  });
}
export async function getTable(id: number) {
  const table = await prisma.tables.findFirst({ where: { id } });
  if (!table) return redirect("/backoffice/tables");

  return table;
}

export async function createTable(formData: FormData) {
  const name = formData.get("name") as string;
  const locationId = (await getSelectedLocation())?.locationId;

  const table = await prisma.tables.create({
    data: { name, locationId: Number(locationId), qrCodeImageUrl: "" },
  });

  const qrCodeImageUrl = await generateQRImage(table);
  await prisma.tables.update({
    where: { id: table.id },
    data: { ...table, qrCodeImageUrl },
  });

  redirect("/backoffice/tables");
}

export async function updateTable(formData: FormData) {
  const name = formData.get("name") as string;
  const id = Number(formData.get("id"));
  await prisma.tables.update({ where: { id }, data: { name } });

  redirect("/backoffice/tables");
}

export async function deleteTable(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.tables.update({ where: { id }, data: { isArchived: true } });

  redirect("/backoffice/tables");
}

export const generateQRImage = async (table: Tables) => {
  const orderAppUrl = `${config.orderAppUrl}?tableId=${table.id}`;
  const generateQRImage = await QRCode.toBuffer(orderAppUrl, { scale: 7 });
  const { url } = await put(
    `foodie-pos/table-${table.id}.png`,
    generateQRImage,
    {
      access: "public",
    }
  );
  return url;
};
