"use server";

import { getCompanyId } from "@/libs/actions";
import { prisma } from "@/libs/prisma";

export async function getCompany() {
  const companyId = await getCompanyId();
  const company = await prisma.company.findFirst({ where: { id: companyId } });
  return company;
}

export async function updateCompany(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;
  const callingCode = formData.get("callingCode") as string;
  const country = formData.get("country") as string;
  await prisma.company.update({
    data: { name, address, city, zipCode, callingCode, country },
    where: { id },
  });

  // redirect("/backoffice/company");
}
