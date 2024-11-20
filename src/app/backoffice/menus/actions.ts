"use server";

import { getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { menuFormSchema } from "@/libs/zodSchemas";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import { z } from "zod";

const CreateMenuValidator = menuFormSchema.omit({
  id: true,
  addonCategoryIds: true,
  isAvailable: true,
});

const DeleteMenuValidator = menuFormSchema.pick({ id: true });

export async function getMenu(id: number) {
  const menu = await prisma.menus.findFirst({
    where: { id: Number(id) },
    include: {
      menuCategoriesMenus: true,
      disabledLocationMenus: true,
      menusAddonCategories: true,
    },
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
  console.log(formData);
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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { errors: err.errors };
    } else {
      console.error("Unexpected error:", err);
      return {
        errors: [
          { message: "Something went wrong.Please contact our support." },
        ],
      };
    }
  }
}

export async function updateMenu(formData: FormData) {
  try {
    const {
      id,
      name,
      price,
      isAvailable,
      menuCategoryIds,
      imageUrl,
      addonCategoryIds,
    } = menuFormSchema.parse({
      id: Number(formData.get("id")),
      price: Number(formData.get("price")),
      name: formData.get("name"),
      isAvailable: !!formData.get("isAvailable"),
      menuCategoryIds: formData.getAll("menuCategoryIds").map(Number),
      addonCategoryIds: formData.getAll("addonCategoryIds").map(Number),
      imageUrl: formData.get("imageUrl"),
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

    const menu = await prisma.menus.findFirst({ where: { id } });
    await prisma.menus.update({
      where: { id },
      data: { name, price, imageUrl: imageUrl ? imageUrl : menu?.imageUrl },
    });

    // update menuCategories
    const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
      where: { menuId: id },
    });
    const menuCategoryIdsFromDB = menuCategoriesMenus.map(
      (item) => item.menuCategoryId
    );
    const isMenuCategoryIdsSame =
      menuCategoryIds.length === menuCategoryIdsFromDB.length &&
      menuCategoryIds.every((menuCategoryId) =>
        menuCategoryIdsFromDB.includes(menuCategoryId)
      );
    if (!isMenuCategoryIdsSame) {
      await prisma.menuCategoriesMenus.deleteMany({ where: { menuId: id } });
      const data = menuCategoryIds.map((menuCategoryId) => ({
        menuId: id,
        menuCategoryId,
      }));
      await prisma.menuCategoriesMenus.createMany({ data });
    }

    // update addonCategories
    const menuAddonCategories = await prisma.menusAddonCategories.findMany({
      where: { menuId: id },
    });
    const addonCategoryIdsFromDB = menuAddonCategories.map(
      (item) => item.addonCategoryId
    );
    const isAddonCategoryIdsSame =
      addonCategoryIds.length === addonCategoryIdsFromDB.length &&
      addonCategoryIds.every((addonCategoryId) =>
        addonCategoryIdsFromDB.includes(addonCategoryId)
      );
    if (!isAddonCategoryIdsSame) {
      await prisma.menusAddonCategories.deleteMany({ where: { menuId: id } });
      const data = addonCategoryIds.map((addonCategoryId) => ({
        menuId: id,
        addonCategoryId,
      }));
      await prisma.menusAddonCategories.createMany({ data });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors };
    } else {
      console.error("Unexpected error:", error);
      return {
        error: [
          { message: "Something went wrong.Please contact our support." },
        ],
      };
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
