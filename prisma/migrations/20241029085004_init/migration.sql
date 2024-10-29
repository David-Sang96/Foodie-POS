-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER DEFAULT 0,
    "isAvailable" BOOLEAN DEFAULT true,

    CONSTRAINT "Menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isAvailable" BOOLEAN DEFAULT true,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "MenuCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategoriesMenus" (
    "id" SERIAL NOT NULL,
    "menuId" INTEGER NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,

    CONSTRAINT "MenuCategoriesMenus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddonCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AddonCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenusAddonCategories" (
    "id" SERIAL NOT NULL,
    "menuId" INTEGER NOT NULL,
    "addonCategoryId" INTEGER NOT NULL,

    CONSTRAINT "MenusAddonCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "addonCategoryId" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisabledLocationMenuCategories" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,

    CONSTRAINT "DisabledLocationMenuCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisabledLocationMenus" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "DisabledLocationMenus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategories" ADD CONSTRAINT "MenuCategories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategoriesMenus" ADD CONSTRAINT "MenuCategoriesMenus_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategoriesMenus" ADD CONSTRAINT "MenuCategoriesMenus_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenusAddonCategories" ADD CONSTRAINT "MenusAddonCategories_addonCategoryId_fkey" FOREIGN KEY ("addonCategoryId") REFERENCES "AddonCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenusAddonCategories" ADD CONSTRAINT "MenusAddonCategories_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addons" ADD CONSTRAINT "Addons_addonCategoryId_fkey" FOREIGN KEY ("addonCategoryId") REFERENCES "AddonCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tables" ADD CONSTRAINT "Tables_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLocationMenuCategories" ADD CONSTRAINT "DisabledLocationMenuCategories_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLocationMenuCategories" ADD CONSTRAINT "DisabledLocationMenuCategories_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLocationMenus" ADD CONSTRAINT "DisabledLocationMenus_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLocationMenus" ADD CONSTRAINT "DisabledLocationMenus_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
