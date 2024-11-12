"use server";

import { getCompanyId, getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { menuCategoryFormSchema } from "@/libs/zodSchemas";
import { redirect } from "next/navigation";
import { z } from "zod";

interface updateTypes {
  id: number;
  isAvailable: boolean;
  name: string;
}

const CreateMenuCategoryValidator = menuCategoryFormSchema.omit({
  id: true,
  isAvailable: true,
});
const UpdateMenuCategoryValidator = menuCategoryFormSchema.omit({
  companyId: true,
});
const DeleteMenuCategoryValidator = menuCategoryFormSchema.pick({ id: true });

export async function getMenuCategory(id: string) {
  const menuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(id), isArchived: false },
    include: { disabledLocationMenuCategories: true },
  });

  if (!menuCategory) return redirect("/backoffice/menu-category");
  return menuCategory;
}

export async function updateMenuCategory({
  name: menuCategoryName,
  id,
  isAvailable: isValid,
}: updateTypes) {
  try {
    const {
      name,
      isAvailable,
      id: menuCategoryId,
    } = UpdateMenuCategoryValidator.parse({
      name: menuCategoryName,
      isAvailable: isValid,
      id,
    });

    const location = await getSelectedLocation();
    if (!isAvailable) {
      await prisma.disabledLocationMenuCategories.create({
        data: { menuCategoryId, locationId: Number(location?.locationId) },
      });
    } else {
      const disableLocationMenuCategory =
        await prisma.disabledLocationMenuCategories.findFirst({
          where: { menuCategoryId, locationId: Number(location?.locationId) },
        });
      if (disableLocationMenuCategory) {
        await prisma.disabledLocationMenuCategories.delete({
          where: { id: disableLocationMenuCategory.id },
        });
      }
    }

    const updatedMenuCategory = await prisma.menuCategories.update({
      data: { name },
      where: { id: menuCategoryId },
    });

    return { error: null, updatedMenuCategory };
  } catch (error) {
    let errorMessages = "";
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errorMessages = errorMessages + err.message + ". " + "\n";
      });
      return { error: errorMessages };
    } else {
      console.error("Unexpected error:", error);
      return { error: "Something went wrong.Please contact our support." };
    }
  }
}

export async function createMenuCategory(menuCategoryName: string) {
  try {
    const { name, companyId } = CreateMenuCategoryValidator.parse({
      name: menuCategoryName,
      companyId: Number(await getCompanyId()),
    });
    const newMenuCategory = await prisma.menuCategories.create({
      data: { name, companyId },
    });
    return { newMenuCategory };
  } catch (error) {
    let errorMessages = "";
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errorMessages = errorMessages + err.message + ". " + "\n";
      });
      return { error: errorMessages };
    } else {
      console.error("Unexpected error:", error);
      return { error: "Something went wrong.Please contact our support." };
    }
  }
}

export async function deleteMenuCategory(menuCategoryId: number) {
  try {
    const { id } = DeleteMenuCategoryValidator.parse({
      id: menuCategoryId,
    });
    await prisma.menuCategories.update({
      where: { id },
      data: { isArchived: true },
    });
    return { error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0].message;
      return { error: errorMessage };
    } else {
      console.error("Unexpected error:", error);
      return { error: "Something went wrong.Please contact our support." };
    }
  }
}
