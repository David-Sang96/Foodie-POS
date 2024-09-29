"use server";

import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function updateMenuCategory(formData: FormData) {
  const id = formData.get("menuCategoryId") as string;
  const updatedMenuCategory = formData.get("menuCategoryName") as string;

  if (!id) {
    throw new Error("Invalid menu category id");
  }

  if (!updatedMenuCategory) {
    throw new Error("Invalid menu category name");
  }

  await prisma.menuCategories.update({
    data: { name: updatedMenuCategory },
    where: { id: Number(id) },
  });
  redirect("/backoffice/menu-categories");
}

export async function createMenuCategory(formData: FormData) {
  const newMenuCategory = formData.get("menuCategoryName") as string;

  if (!newMenuCategory) {
    throw new Error("Invalid menu category name.");
  }

  await prisma.menuCategories.create({ data: { name: newMenuCategory } });
  redirect("/backoffice/menu-categories");
}

export async function deleteMenuCategory(formData: FormData) {
  const id = formData.get("menuCategoryId") as string;

  if (!id) {
    throw new Error("Invalid menu category id");
  }

  await prisma.menuCategories.delete({ where: { id: Number(id) } });
  redirect("/backoffice/menu-categories");
}
