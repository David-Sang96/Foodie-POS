/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `MenuCategories` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Menus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuCategories" DROP COLUMN "isAvailable";

-- AlterTable
ALTER TABLE "Menus" DROP COLUMN "isAvailable";
