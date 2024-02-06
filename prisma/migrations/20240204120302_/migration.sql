-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tenement_Rent" (
    "tenement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_true_deleted" BOOLEAN NOT NULL DEFAULT false,
    "tenement_status" TEXT NOT NULL,
    "renter_start_date" TEXT NOT NULL,
    "renter_end_date" TEXT NOT NULL,
    "renter_name" TEXT NOT NULL,
    "renter_id_images" TEXT NOT NULL,
    "renter_phone" TEXT NOT NULL,
    "renter_jobtitle" TEXT NOT NULL,
    "renter_guarantor_name" TEXT NOT NULL,
    "renter_guarantor_phone" TEXT NOT NULL,
    "renter_remark" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tenement_Rent_tenement_id_fkey" FOREIGN KEY ("tenement_id") REFERENCES "Tenement_Create" ("tenement_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tenement_Rent" ("createdAt", "is_deleted", "renter_end_date", "renter_guarantor_name", "renter_guarantor_phone", "renter_id_images", "renter_jobtitle", "renter_name", "renter_phone", "renter_remark", "renter_start_date", "tenement_id", "tenement_status", "updatedAt") SELECT "createdAt", "is_deleted", "renter_end_date", "renter_guarantor_name", "renter_guarantor_phone", "renter_id_images", "renter_jobtitle", "renter_name", "renter_phone", "renter_remark", "renter_start_date", "tenement_id", "tenement_status", "updatedAt" FROM "Tenement_Rent";
DROP TABLE "Tenement_Rent";
ALTER TABLE "new_Tenement_Rent" RENAME TO "Tenement_Rent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
