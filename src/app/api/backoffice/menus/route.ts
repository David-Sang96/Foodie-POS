/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const menus = await prisma.menus.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(menus, { status: 200 });
}

export async function POST(req: Request) {
  const menu = await req.json();
  const { name, price, isAvailable, menuCategoryIds } = menu;
  if (
    !name ||
    price === undefined ||
    isAvailable === undefined ||
    menuCategoryIds.length === 0
  )
    return NextResponse.json({ error: "Bad request" }, { status: 422 });

  const newMenu = await prisma.menus.create({
    data: { name, price, isAvailable },
  });

  const data = menuCategoryIds.map((menuCategoryId: number) => ({
    menuId: newMenu.id,
    menuCategoryId,
  }));

  await prisma.menuCategoriesMenus.createMany({
    data,
  });

  return NextResponse.json({ message: "success" }, { status: 201 });
}

export async function PUT(req: Request) {
  const menu = await req.json();
  const { name, price, isAvailable, id, menuCategoryIds } = menu;
  if (
    !name ||
    price === undefined ||
    isAvailable === undefined ||
    menuCategoryIds.length === 0
  )
    return NextResponse.json({ error: "Bad request" }, { status: 400 });

  await prisma.menus.update({
    where: { id },
    data: { name, price, isAvailable },
  });

  const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuId: id },
  });
  const mnuCategoryIdsFromDB = menuCategoriesMenus.map(
    (item) => item.menuCategoryId
  );

  const isSame =
    menuCategoryIds.length === mnuCategoryIdsFromDB.length &&
    menuCategoryIds.every((itemId: number) =>
      mnuCategoryIdsFromDB.includes(itemId)
    );

  if (!isSame) {
    await prisma.menuCategoriesMenus.deleteMany({ where: { menuId: id } });
    const data = menuCategoryIds.map((menuCategoryId: number) => ({
      menuId: id,
      menuCategoryId,
    }));
    await prisma.menuCategoriesMenus.createMany({ data });
  }
  return NextResponse.json(null, { status: 200 });
}
