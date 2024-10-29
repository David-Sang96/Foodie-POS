"use server";

import { getCompanyId } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export const getLocation = async (id: number) => {
  const location = await prisma.locations.findUnique({ where: { id } });
  if (!location) return redirect("/backoffice/locations");
  return location;
};

export const updateLocation = async (formData: FormData) => {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  await prisma.locations.update({ data: { name }, where: { id } });
  redirect("/backoffice/locations");
};

export const createLocation = async (formData: FormData) => {
  const name = formData.get("name") as string;
  await prisma.locations.create({
    data: { name, companyId: Number(await getCompanyId()) },
  });
  redirect("/backoffice/locations");
};

export const deleteLocation = async (formData: FormData) => {
  const id = Number(formData.get("id"));
  await prisma.locations.delete({ where: { id } });
  redirect("/backoffice/locations");
};
