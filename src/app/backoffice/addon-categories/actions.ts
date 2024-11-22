"use server";

import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function getAddonCategory(id: number) {
  const addonCategory = await prisma.addonCategories.findUnique({
    where: { id },
    include: { menusAddonCategories: true },
  });
  if (!addonCategory) return redirect("/backoffice/addon-categories");
  return addonCategory;
}

export async function createAddonCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const isRequired = !!formData.get("isRequired");
  const menuIds = formData.getAll("menu").map(Number);

  const newAddonCategory = await prisma.addonCategories.create({
    data: { name, isRequired },
  });

  const data = menuIds.map((menuId) => ({
    addonCategoryId: newAddonCategory.id,
    menuId,
  }));

  await prisma.menusAddonCategories.createMany({ data });

  redirect("/backoffice/addon-categories");
}

export async function updateAddonCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const isRequired = !!formData.get("isRequired");
  const menuIds = formData.getAll("menu").map(Number);

  const updatedAddonCategory = await prisma.addonCategories.update({
    where: { id },
    data: { name, isRequired },
  });

  const menuIdsFromDB = await prisma.menusAddonCategories.findMany({
    where: { addonCategoryId: updatedAddonCategory.id },
  });

  const isSame =
    menuIds.length === menuIdsFromDB.length &&
    menuIdsFromDB.every((item) => menuIds.includes(item.menuId));

  if (!isSame) {
    await prisma.menusAddonCategories.deleteMany({
      where: { addonCategoryId: updatedAddonCategory.id },
    });

    const data = menuIds.map((menuId) => ({
      menuId,
      addonCategoryId: updatedAddonCategory.id,
    }));

    await prisma.menusAddonCategories.createMany({ data });
  }

  redirect("/backoffice/addon-categories");
}

export async function deleteAddonCategory(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.menusAddonCategories.deleteMany({
    where: { addonCategoryId: id },
  });

  await prisma.addonCategories.update({
    where: { id },
    data: { isArchived: true },
  });

  redirect("/backoffice/addon-categories");
}
