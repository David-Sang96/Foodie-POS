/*
  Warnings:

  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "zipCode" INTEGER NOT NULL;