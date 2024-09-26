/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const menuCategories = await prisma.menuCategories.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(menuCategories, { status: 200 });
}

export async function POST(req: Request) {
  const menuCategory = await req.json();
  const { name } = menuCategory;
  if (!name)
    return NextResponse.json({ error: "Bad request" }, { status: 422 });
  await prisma.menuCategories.create({ data: { name } });
  return NextResponse.json(null, { status: 201 });
}

export async function PUT(req: Request) {
  const menuCategory = await req.json();
  const { name, id } = menuCategory;
  if (!name)
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  await prisma.menuCategories.update({ where: { id }, data: { name } });
  return NextResponse.json(null, { status: 200 });
}
