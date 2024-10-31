"use server";

import { getCompanyId, getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function getMenuCategory(id: string) {
  const menuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(id) },
    include: { disabledLocationMenuCategories: true },
  });

  if (!menuCategory) return redirect("/backoffice/menu-category");
  return menuCategory;
}

export async function updateMenuCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const isAvailable = !!formData.get("isAvailable");
  const name = formData.get("name") as string;

  if (!id) {
    throw new Error("Invalid menu category id");
  }

  if (!name) {
    throw new Error("Invalid menu category name");
  }

  if (!isAvailable) {
    const locationId = await getSelectedLocation();
    await prisma.disabledLocationMenuCategories.create({
      data: { menuCategoryId: id, locationId: Number(locationId?.locationId) },
    });
  } else {
    const disableLocationMenuCategory =
      await prisma.disabledLocationMenuCategories.findFirst({
        where: { menuCategoryId: id },
      });
    if (disableLocationMenuCategory) {
      await prisma.disabledLocationMenuCategories.delete({
        where: { id: disableLocationMenuCategory.id },
      });
    }
  }

  await prisma.menuCategories.update({
    data: { name },
    where: { id },
  });
  redirect("/backoffice/menu-categories");
}

export async function createMenuCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const companyId = (await getCompanyId()) as number;

  if (!name) {
    throw new Error("Invalid menu category name.");
  }

  await prisma.menuCategories.create({ data: { name, companyId } });
  redirect("/backoffice/menu-categories");
}

export async function deleteMenuCategory(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Invalid menu category id");
  }

  await prisma.menuCategories.delete({ where: { id: Number(id) } });
  redirect("/backoffice/menu-categories");
}
