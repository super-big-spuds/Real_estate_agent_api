/*
  Warnings:

  - You are about to drop the column `tenement_style` on the `Tenement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tenement_Create" (
    "tenement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_rating" INTEGER NOT NULL,
    "main_building" INTEGER NOT NULL,
    "inside_rating" INTEGER NOT NULL,
    "affiliated_building" INTEGER NOT NULL,
    "public_building" INTEGER NOT NULL,
    "unregistered_area" INTEGER NOT NULL,
    "management_magnification" INTEGER NOT NULL,
    "management_fee" INTEGER NOT NULL,
    "tenement_floor" INTEGER NOT NULL,
    "tenement_host_name" TEXT NOT NULL,
    "tenement_host_telphone" TEXT NOT NULL,
    "tenement_host_phone" TEXT NOT NULL,
    "tenement_host_line" TEXT NOT NULL,
    "tenement_host_remittance_bank" TEXT NOT NULL,
    "tenement_host_remittance_account" TEXT NOT NULL,
    "tenement_host_address" TEXT NOT NULL,
    "tenement_host_birthday" TEXT NOT NULL,
    "tenement_host_hobby" TEXT NOT NULL,
    "tenement_host_remark" TEXT NOT NULL,
    "selling_price" INTEGER,
    "rent_price" INTEGER,
    "deposit_price" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tenement_Create_tenement_id_fkey" FOREIGN KEY ("tenement_id") REFERENCES "Tenement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tenement_Create" ("affiliated_building", "createdAt", "deposit_price", "inside_rating", "main_building", "management_fee", "management_magnification", "public_building", "rent_price", "selling_price", "tenement_floor", "tenement_host_address", "tenement_host_birthday", "tenement_host_hobby", "tenement_host_line", "tenement_host_name", "tenement_host_phone", "tenement_host_remark", "tenement_host_remittance_account", "tenement_host_remittance_bank", "tenement_host_telphone", "tenement_id", "total_rating", "unregistered_area", "updatedAt") SELECT "affiliated_building", "createdAt", "deposit_price", "inside_rating", "main_building", "management_fee", "management_magnification", "public_building", "rent_price", "selling_price", "tenement_floor", "tenement_host_address", "tenement_host_birthday", "tenement_host_hobby", "tenement_host_line", "tenement_host_name", "tenement_host_phone", "tenement_host_remark", "tenement_host_remittance_account", "tenement_host_remittance_bank", "tenement_host_telphone", "tenement_id", "total_rating", "unregistered_area", "updatedAt" FROM "Tenement_Create";
DROP TABLE "Tenement_Create";
ALTER TABLE "new_Tenement_Create" RENAME TO "Tenement_Create";
CREATE TABLE "new_Tenement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tenement_address" TEXT NOT NULL,
    "tenement_product_type" TEXT NOT NULL,
    "tenement_type" TEXT NOT NULL,
    "tenement_status" TEXT NOT NULL,
    "tenement_face" TEXT NOT NULL,
    "tenement_images" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "owner" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Tenement_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tenement" ("createdAt", "id", "is_deleted", "owner", "tenement_address", "tenement_face", "tenement_images", "tenement_product_type", "tenement_status", "tenement_type", "updatedAt") SELECT "createdAt", "id", "is_deleted", "owner", "tenement_address", "tenement_face", "tenement_images", "tenement_product_type", "tenement_status", "tenement_type", "updatedAt" FROM "Tenement";
DROP TABLE "Tenement";
ALTER TABLE "new_Tenement" RENAME TO "Tenement";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");
