"use server";

import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function updateMenuCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;

  if (!id) {
    throw new Error("Invalid menu category id");
  }

  if (!name) {
    throw new Error("Invalid menu category name");
  }

  await prisma.menuCategories.update({
    data: { name },
    where: { id },
  });
  redirect("/backoffice/menu-categories");
}

export async function createMenuCategory(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Invalid menu category name.");
  }

  await prisma.menuCategories.create({ data: { name } });
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
