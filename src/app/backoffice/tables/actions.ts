"use server";

import { getCompanyLocations } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function getTable(id: number) {
  const table = await prisma.tables.findFirst({ where: { id } });
  if (!table) return redirect("/backoffice/tables");

  return table;
}

export async function createTable(formData: FormData) {
  const name = formData.get("name") as string;
  await prisma.tables.create({
    data: { name, locationId: (await getCompanyLocations())[0].id },
  });

  redirect("/backoffice/tables");
}

export async function updateTable(formData: FormData) {
  const name = formData.get("name") as string;
  const id = Number(formData.get("id"));
  await prisma.tables.update({ where: { id }, data: { name } });

  redirect("/backoffice/tables");
}

export async function deleteTable(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.tables.delete({ where: { id } });

  redirect("/backoffice/tables");
}
