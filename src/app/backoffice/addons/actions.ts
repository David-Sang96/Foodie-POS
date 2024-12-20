"use server";

import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function getAddon(id: number) {
  const addon = await prisma.addons.findUnique({ where: { id } });
  if (!addon) return redirect("/backoffice/addons");

  return addon;
}

export async function createAddon(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const isAvailable = !!formData.get("isAvailable");
  const addonCategoryId = Number(formData.get("addonCategoryId"));

  await prisma.addons.create({
    data: { name, price, addonCategoryId, isAvailable },
  });

  redirect("/backoffice/addons");
}

export async function updateAddon(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const isAvailable = !!formData.get("isAvailable");
  const addonCategoryId = Number(formData.get("addonCategoryId"));
  const id = Number(formData.get("id"));

  await prisma.addons.update({
    where: { id },
    data: { name, price, addonCategoryId, isAvailable },
  });

  redirect("/backoffice/addons");
}

export async function deleteAddon(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.addons.update({
    where: { id },
    data: { isArchived: true },
  });

  redirect("/backoffice/addons");
}
