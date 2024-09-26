/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  console.log(params);
  const menu = await prisma.menus.findFirst({
    where: { id: Number(params.id) },
    include: {
      menuCategoriesMenus: true,
    },
  });
  if (!menu) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  return NextResponse.json(menu, { status: 200 });
}

export async function DELETE(req: Request, { params }: Params) {
  const menuId = Number(params.id);
  await prisma.menuCategoriesMenus.deleteMany({
    where: { menuId },
  });

  await prisma.menus.delete({ where: { id: menuId } });

  return NextResponse.json(null, { status: 200 });
}
