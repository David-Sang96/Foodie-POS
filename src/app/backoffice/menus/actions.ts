"use server";

import { getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { menuFormSchema } from "@/libs/zodSchemas";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import { z } from "zod";

interface UpdateMenuTypes {
  menuId: number;
  menuName: string;
  menuPrice: number;
  isAvailable: boolean;
  menuCategoryIds: number[];
}

const CreateMenuValidator = menuFormSchema.omit({
  id: true,
  isAvailable: true,
});
const updateMenuValidator = menuFormSchema.omit({ imageUrl: true });
const DeleteMenuValidator = menuFormSchema.pick({ id: true });

export async function getMenu(id: number) {
  const menu = await prisma.menus.findFirst({
    where: { id: Number(id) },
    include: { menuCategoriesMenus: true, disabledLocationMenus: true },
  });

  if (!menu) return redirect("/backoffice/menus");
  return menu;
}

// server side file upload
export async function createMenuServer(formData: FormData) {
  try {
    const { name, price, menuCategoryIds } = CreateMenuValidator.parse({
      name: formData.get("name"),
      price: Number(formData.get("price")),
      menuCategoryIds: formData.getAll("menuCategory").map(Number),
    });
    const file = formData.get("file") as File;
    const newMenu = await prisma.menus.create({
      data: { name, price },
    });

    const data = menuCategoryIds.map((menuCategoryId) => ({
      menuId: newMenu.id,
      menuCategoryId,
    }));
    await prisma.menuCategoriesMenus.createMany({ data });

    if (file && file.size) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const { url } = await put(
        `foodie-pos/menus/${new Date().getTime()}-${file.name}`,
        buffer,
        {
          access: "public",
        }
      );
      await prisma.menus.update({
        where: { id: newMenu.id },
        data: { ...newMenu, imageUrl: url },
      });
    }
    return { error: null, newMenu };
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

// client side file upload
export async function createMenuClient(formData: FormData) {
  try {
    const { name, price, menuCategoryIds, imageUrl } =
      CreateMenuValidator.parse({
        name: formData.get("name"),
        price: Number(formData.get("price")),
        menuCategoryIds: formData.getAll("menuCategory").map(Number),
        imageUrl:
          formData.get("imageUrl") ||
          "https://t2fdyui6j2e69if5.public.blob.vercel-storage.com/foodie-pos/menus/default-img-ctpGW8fV9U9WsGQq9Ipf99pbrx09F9.png",
      });
    const newMenu = await prisma.menus.create({
      data: { name, price, imageUrl },
    });

    const data = menuCategoryIds.map((menuCategoryId) => ({
      menuId: newMenu.id,
      menuCategoryId,
    }));
    await prisma.menuCategoriesMenus.createMany({ data });

    return { error: null, newMenu };
  } catch (error) {
    let errorMessages = "";
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        return (errorMessages = errorMessages + err.message + ". " + "\n");
      });
      return { error: errorMessages };
    } else {
      console.error("Unexpected error:", error);
      return { error: "Something went wrong.Please contact our support." };
    }
  }
}

export async function updateMenu({
  menuId,
  menuName,
  menuPrice,
  menuCategoryIds: ids,
  isAvailable: isValid,
}: UpdateMenuTypes) {
  try {
    const { id, name, price, isAvailable, menuCategoryIds } =
      updateMenuValidator.parse({
        id: menuId,
        price: menuPrice,
        name: menuName,
        isAvailable: isValid,
        menuCategoryIds: ids,
      });

    const selectedLocationId = await getSelectedLocation();
    if (!isAvailable) {
      await prisma.disabledLocationMenus.create({
        data: {
          menuId: id,
          locationId: Number(selectedLocationId?.locationId),
        },
      });
    } else {
      const disableLocationMenu = await prisma.disabledLocationMenus.findFirst({
        where: {
          menuId: id,
          locationId: Number(selectedLocationId?.locationId),
        },
      });
      if (disableLocationMenu) {
        await prisma.disabledLocationMenus.delete({
          where: { id: disableLocationMenu.id },
        });
      }
    }
    await prisma.menus.update({
      where: { id },
      data: { name, price },
    });

    const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
      where: { menuId: id },
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
      await prisma.menuCategoriesMenus.deleteMany({ where: { menuId: id } });
      const data = menuCategoryIds.map((menuCategoryId) => ({
        menuId: id,
        menuCategoryId,
      }));
      await prisma.menuCategoriesMenus.createMany({ data });
    }
    return { error: null };
  } catch (error) {
    let errorMessages = "";
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        return (errorMessages += err.message + ". " + "\n");
      });
      return { error: errorMessages };
    } else {
      console.error("Unexpected error:", error);
      return { error: "Something went wrong.Please contact our support." };
    }
  }
}

export async function deleteMenu(menuId: number) {
  try {
    const { id } = DeleteMenuValidator.parse({
      id: menuId,
    });
    await prisma.menuCategoriesMenus.deleteMany({
      where: { menuId: id },
    });
    await prisma.menusAddonCategories.deleteMany({ where: { menuId: id } });
    await prisma.menus.update({ where: { id }, data: { isArchived: true } });

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
