"use server";

import { generateQRImage } from "@/app/backoffice/tables/actions";
import { getServerSession, User } from "next-auth";
import { prisma } from "./prisma";

export async function getUser(email: string) {
  return await prisma.users.findFirst({ where: { email } });
}

export async function createDefaultData(nextAuthUser: User) {
  const { name, email } = nextAuthUser;
  const company = await prisma.company.create({
    data: {
      name: "Default Company",
      address: "Default Address",
      city: "Default City",
      country: "Default Country",
      zipCode: "0000",
      callingCode: "+60",
    },
  });
  const user = await prisma.users.create({
    data: { name: String(name), email: String(email), companyId: company.id },
  });

  const menuCategory = await prisma.menuCategories.create({
    data: { name: "Default Menu Category", companyId: company.id },
  });

  const menu = await prisma.menus.create({
    data: { name: "Default Menu" },
  });

  await prisma.menuCategoriesMenus.create({
    data: { menuId: menu.id, menuCategoryId: menuCategory.id },
  });

  const addonCategory = await prisma.addonCategories.create({
    data: { name: "Default Addon Category" },
  });

  await prisma.menusAddonCategories.create({
    data: { menuId: menu.id, addonCategoryId: addonCategory.id },
  });

  const defaultAddons = [
    "Default Addon 1",
    "Default Addon 2",
    "Default Addon 3",
  ];
  const data = defaultAddons.map((addon) => ({
    name: addon,
    price: 300,
    addonCategoryId: addonCategory.id,
  }));

  await prisma.addons.createMany({ data });

  const location = await prisma.locations.create({
    data: { name: "Default Location", companyId: company.id },
  });

  const table = await prisma.tables.create({
    data: {
      name: "Default Table",
      locationId: location.id,
      qrCodeImageUrl: "",
    },
  });
  const qrCodeImageUrl = await generateQRImage(table);
  await prisma.tables.update({
    where: { id: table.id },
    data: { ...table, qrCodeImageUrl },
  });

  await prisma.selectedLocations.create({
    data: { userId: user.id, locationId: location.id },
  });
}

export async function getCompanyId() {
  const session = await getServerSession();
  const dbUser = await prisma.users.findFirst({
    where: { email: session?.user?.email as string },
  });
  const company = await prisma.company.findFirst({
    where: { id: dbUser?.companyId },
  });
  return company?.id;
}

export async function getDBUserId() {
  const session = await getServerSession();
  const dbUser = await prisma.users.findFirst({
    where: { email: session?.user?.email as string },
  });
  return dbUser?.id;
}

export async function getCompanyMenuCategories() {
  return await prisma.menuCategories.findMany({
    orderBy: { id: "desc" },
    where: { companyId: await getCompanyId() },
    include: { disabledLocationMenuCategories: true },
  });
}

export async function getCompanyMenus() {
  const menuCategories = await getCompanyMenuCategories();
  const menuCategoryIds = menuCategories.map((item) => item.id);
  const menuCategoryMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menuCategoryIds } },
  });
  const menuIds = menuCategoryMenus.map((item) => item.menuId);
  return await prisma.menus.findMany({
    orderBy: { id: "desc" },
    where: { id: { in: menuIds } },
    include: { disabledLocationMenus: true },
  });
}

export async function getCompanyAddonCategories() {
  const menus = await getCompanyMenus();
  const menuIds = menus.map((item) => item.id);
  const menuAddonCategories = await prisma.menusAddonCategories.findMany({
    where: { menuId: { in: menuIds } },
  });
  const addonCategoryIds = menuAddonCategories.map(
    (item) => item.addonCategoryId
  );
  return await prisma.addonCategories.findMany({
    orderBy: { id: "desc" },
    where: { id: { in: addonCategoryIds } },
  });
}

export async function getCompanyAddons() {
  const addonCategories = await getCompanyAddonCategories();
  const addonCategoryIds = addonCategories.map((item) => item.id);
  return await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds } },
  });
}

export async function getCompanyTables() {
  const companyId = await getCompanyId();
  const locationIds = (
    await prisma.locations.findMany({ where: { companyId } })
  ).map((item) => item.id);
  return await prisma.tables.findMany({
    where: { locationId: { in: locationIds } },
  });
}

export async function getLocationTables(locationId: number) {
  return await prisma.tables.findMany({ where: { locationId } });
}

export async function getCompanyLocations() {
  return await prisma.locations.findMany({
    orderBy: { id: "asc" },
    where: { companyId: await getCompanyId() },
  });
}

export async function getSelectedLocation() {
  return await prisma.selectedLocations.findFirst({
    where: { userId: await getDBUserId() },
    include: { locations: true },
  });
}
