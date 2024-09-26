import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
interface Props {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  const menuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(params.id) },
  });
  return NextResponse.json(menuCategory, { status: 200 });
}

export async function DELETE(req: Request, { params }: Props) {
  await prisma.menuCategories.delete({ where: { id: Number(params.id) } });
  return NextResponse.json(null, { status: 200 });
}
