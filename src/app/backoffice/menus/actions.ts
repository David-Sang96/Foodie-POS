"use server";

import { getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function getMenu(id: number) {
  const menu = await prisma.menus.findFirst({
    where: { id: Number(id) },
    include: { menuCategoriesMenus: true, disabledLocationMenus: true },
  });

  if (!menu) return redirect("/backoffice/menus");
  return menu;
}

export async function createMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));

  //.map(Number): This applies the Number function to each element of the array, converting them from strings to actual numbers.
  const menuCategoryIds = formData.getAll("menuCategory").map(Number);

  const newMenu = await prisma.menus.create({
    data: { name, price },
  });

  const data = menuCategoryIds.map((menuCategoryId) => ({
    menuId: newMenu.id,
    menuCategoryId,
  }));

  await prisma.menuCategoriesMenus.createMany({ data });
  redirect("/backoffice/menus");
}

export async function updateMenu(formData: FormData) {
  const menuId = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const menuCategoryIds = formData.getAll("menuCategory").map(Number);
  const isAvailable = !!formData.get("isAvailable");

  const selectedLocationId = await getSelectedLocation();
  if (!isAvailable) {
    await prisma.disabledLocationMenus.create({
      data: { menuId, locationId: Number(selectedLocationId?.locationId) },
    });
  } else {
    const disableLocationMenu = await prisma.disabledLocationMenus.findFirst({
      where: { menuId, locationId: Number(selectedLocationId?.locationId) },
    });
    if (disableLocationMenu) {
      await prisma.disabledLocationMenus.delete({
        where: { id: disableLocationMenu.id },
      });
    }
  }

  await prisma.menus.update({
    where: { id: menuId },
    data: { name, price },
  });

  const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuId },
  });

  const menuCategoryIdsFromDB = menuCategoriesMenus.map(
    (item) => item.menuCategoryId
  );

  const isSame =
    menuCategoryIds.length === menuCategoryIdsFromDB.length &&
    menuCategoryIds.every((menuCategoryId) =>
      menuCategoryIdsFromDB.includes(menuCategoryId)
    );

  if (!isSame) {
    await prisma.menuCategoriesMenus.deleteMany({ where: { menuId } });
    const data = menuCategoryIds.map((menuCategoryId) => ({
      menuId,
      menuCategoryId,
    }));
    await prisma.menuCategoriesMenus.createMany({ data });
  }

  redirect("/backoffice/menus");
}

export async function deleteMenu(formData: FormData) {
  const menuId = Number(formData.get("id"));
  await prisma.menuCategoriesMenus.deleteMany({
    where: { menuId },
  });

  await prisma.menusAddonCategories.deleteMany({ where: { menuId } });

  await prisma.menus.delete({ where: { id: menuId } });
  redirect("/backoffice/menus");
}
