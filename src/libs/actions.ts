"use server";

import { generateQRImage } from "@/app/backoffice/tables/actions";
import { getServerSession, User } from "next-auth";
import { prisma } from "./prisma";

export async function getUser(email: string) {
  return await prisma.users.findUnique({ where: { email } });
}

// initial default data creation
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
        "https://t2fdyui6j2e69if5.public.blob.vercel-storage.com/foodie-pos/menus/photo_2024-12-11_13-01-12-MvGUPF8V1EyvgztBSvL6ogD3aGI6mK.jpg",
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

// company
export async function getCompanyId() {
  const session = await getServerSession();
  const dbUser = await prisma.users.findUnique({
    where: { email: session?.user?.email as string },
  });
  const company = await prisma.company.findFirst({
    where: { id: dbUser?.companyId, isArchived: false },
  });
  return company?.id;
}

// user
export async function getDBUserId() {
  const session = await getServerSession();
  const dbUser = await prisma.users.findUnique({
    where: { email: session?.user?.email as string, isArchived: false },
  });
  return dbUser?.id;
}

// menu-categories
export async function getCompanyMenuCategories() {
  return await prisma.menuCategories.findMany({
    orderBy: { id: "desc" },
    where: { companyId: await getCompanyId(), isArchived: false },
    include: { disabledLocationMenuCategories: true },
  });
}

// menus
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

// addon-categories
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
    include: { menusAddonCategories: true },
  });
}

// addons
export async function getCompanyAddons() {
  const addonCategories = await getCompanyAddonCategories();
  const addonCategoryIds = addonCategories.map((item) => item.id);
  return await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds }, isArchived: false },
  });
}

// tables
export async function getCompanyTables() {
  const companyId = await getCompanyId();
  const locationIds = (
    await prisma.locations.findMany({ where: { companyId, isArchived: false } })
  ).map((item) => item.id);
  return await prisma.tables.findMany({
    where: { locationId: { in: locationIds }, isArchived: false },
  });
}

// locations
export async function getCompanyLocations() {
  return await prisma.locations.findMany({
    orderBy: { id: "asc" },
    where: { companyId: await getCompanyId(), isArchived: false },
  });
}

// current selected location
export async function getSelectedLocation() {
  return await prisma.selectedLocations.findFirst({
    where: { userId: await getDBUserId(), isArchived: false },
    include: { locations: true },
  });
}

// get location with table id
export async function getCurrentLocationByTableId(tableId: string) {
  const table = await prisma.tables.findUnique({
    where: { id: Number(tableId), isArchived: false },
  });
  return await prisma.locations.findUnique({
    where: { id: table?.locationId, isArchived: false },
  });
}

// tables in selected location
export async function getSelectedLocationTables() {
  const selectedLocationId = (await getSelectedLocation())?.locationId;
  return await prisma.tables.findMany({
    where: { locationId: selectedLocationId, isArchived: false },
  });
}

// get company with table id
export async function getCompanyByTableId(tableId: string) {
  const table = await prisma.tables.findUnique({
    where: { id: Number(tableId), isArchived: false },
  });
  const location = await prisma.locations.findUnique({
    where: { id: table?.locationId, isArchived: false },
  });
  return await prisma.company.findUnique({
    where: { id: location?.companyId, isArchived: false },
  });
}

// get menu-categories with table id
export async function getMenuCategoriesByTableId(tableId: string) {
  const company = await getCompanyByTableId(tableId);
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: company?.id, isArchived: false },
    include: { menuCategoriesMenus: true, company: true },
  });
  const location = await getCurrentLocationByTableId(tableId);
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

// get menus with menu-category ids
export async function getMenusByMenuCategoryIds(
  menuCategoryIds: number[],
  tableId: string
) {
  const location = await getCurrentLocationByTableId(tableId);
  const menuCategoryMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
  });
  const menuIds = menuCategoryMenus.map((item) => item.menuId);
  const menus = await prisma.menus.findMany({
    where: { id: { in: menuIds }, isArchived: false },
  });
  const disabledMenus = await prisma.disabledLocationMenus.findMany({
    where: {
      menuId: { in: menuIds },
      locationId: location?.id,
      isArchived: false,
    },
  });
  const disabledMenuIds = disabledMenus.map((item) => item.menuId);
  return menus.filter((menu) => !disabledMenuIds.includes(menu.id));
}
