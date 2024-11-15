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
    data: {
      name: "Default Menu",
      imageUrl:
        "https://t2fdyui6j2e69if5.public.blob.vercel-storage.com/foodie-pos/menus/default-img-ctpGW8fV9U9WsGQq9Ipf99pbrx09F9.png",
    },
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
    where: { id: dbUser?.companyId, isArchived: false },
  });
  return company?.id;
}

export async function getDBUserId() {
  const session = await getServerSession();
  const dbUser = await prisma.users.findFirst({
    where: { email: session?.user?.email as string, isArchived: false },
  });
  return dbUser?.id;
}

export async function getCompanyMenuCategories() {
  return await prisma.menuCategories.findMany({
    orderBy: { id: "desc" },
    where: { companyId: await getCompanyId(), isArchived: false },
    include: { disabledLocationMenuCategories: true },
  });
}

export async function getCompanyMenus() {
  const menuCategories = await getCompanyMenuCategories();
  const menuCategoryIds = menuCategories.map((item) => item.id);
  const menuCategoryMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
  });
  const menuIds = menuCategoryMenus.map((item) => item.menuId);
  return await prisma.menus.findMany({
    orderBy: { id: "desc" },
    where: { id: { in: menuIds }, isArchived: false },
    include: { disabledLocationMenus: true },
  });
}

export async function getCompanyAddonCategories() {
  const menus = await getCompanyMenus();
  const menuIds = menus.map((item) => item.id);
  const menuAddonCategories = await prisma.menusAddonCategories.findMany({
    where: { menuId: { in: menuIds }, isArchived: false },
  });
  const addonCategoryIds = menuAddonCategories.map(
    (item) => item.addonCategoryId
  );
  return await prisma.addonCategories.findMany({
    orderBy: { id: "desc" },
    where: { id: { in: addonCategoryIds }, isArchived: false },
  });
}

export async function getCompanyAddons() {
  const addonCategories = await getCompanyAddonCategories();
  const addonCategoryIds = addonCategories.map((item) => item.id);
  return await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds }, isArchived: false },
  });
}

export async function getCompanyTables() {
  const companyId = await getCompanyId();
  const locationIds = (
    await prisma.locations.findMany({ where: { companyId, isArchived: false } })
  ).map((item) => item.id);
  return await prisma.tables.findMany({
    where: { locationId: { in: locationIds }, isArchived: false },
  });
}

export async function getLocationTables(locationId: number) {
  return await prisma.tables.findMany({
    where: { locationId, isArchived: false },
  });
}

export async function getCompanyLocations() {
  return await prisma.locations.findMany({
    orderBy: { id: "asc" },
    where: { companyId: await getCompanyId(), isArchived: false },
  });
}

export async function getSelectedLocation() {
  return await prisma.selectedLocations.findFirst({
    where: { userId: await getDBUserId(), isArchived: false },
    include: { locations: true },
  });
}

export async function getCompanyByTableId(tableId: string) {
  const table = await prisma.tables.findFirst({
    where: { id: Number(tableId), isArchived: false },
  });
  const location = await prisma.locations.findFirst({
    where: { id: table?.locationId, isArchived: false },
  });
  return await prisma.company.findFirst({
    where: { id: location?.companyId, isArchived: false },
  });
}

export async function getMenuCategoriesByTableId(tableId: string) {
  const company = await getCompanyByTableId(tableId);
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: company?.id, isArchived: false },
  });
  const table = await prisma.tables.findFirst({
    where: { id: Number(tableId), isArchived: false },
  });
  const location = await prisma.locations.findFirst({
    where: { id: table?.locationId, isArchived: false },
  });
  const disabledLocations =
    await prisma.disabledLocationMenuCategories.findMany({
      where: { locationId: location?.id, isArchived: false },
    });

  const disabledLocationIds = disabledLocations.map(
    (item) => item.menuCategoryId
  );
  return menuCategories.filter(
    (item) => !disabledLocationIds.includes(item.id)
  );
}
