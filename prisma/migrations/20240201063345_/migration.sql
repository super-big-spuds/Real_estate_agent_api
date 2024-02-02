-- CreateTable
CREATE TABLE "Tenement" (
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

-- CreateTable
CREATE TABLE "Tenement_Market" (
    "tenement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "tenement_area_max" INTEGER NOT NULL,
    "tenement_area_min" INTEGER NOT NULL,
    "burget_rent_max" INTEGER NOT NULL,
    "burget_rent_min" INTEGER NOT NULL,
    "hopefloor_max" INTEGER NOT NULL,
    "hopefloor_min" INTEGER NOT NULL,
    "market_state" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tenement_Market_tenement_id_fkey" FOREIGN KEY ("tenement_id") REFERENCES "Tenement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tenement_Rent" (
    "tenement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateTable
CREATE TABLE "Tenement_Develop" (
    "tenement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tenement_Develop_tenement_id_fkey" FOREIGN KEY ("tenement_id") REFERENCES "Tenement_Create" ("tenement_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tenement_Sell" (
    "tenement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "buyer_order_date" TEXT NOT NULL,
    "buyer_handout_date" TEXT NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_id_images" TEXT NOT NULL,
    "buyer_phone" TEXT NOT NULL,
    "buyer_jobtitle" TEXT NOT NULL,
    "buyer_remark" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tenement_Sell_tenement_id_fkey" FOREIGN KEY ("tenement_id") REFERENCES "Tenement_Create" ("tenement_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tenement_Create" (
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
    "deposit_price" INTEGER,
    "selling_price" INTEGER,
    "rent_price" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tenement_Create_tenement_id_fkey" FOREIGN KEY ("tenement_id") REFERENCES "Tenement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tenement_no" TEXT NOT NULL,
    "collection_name" TEXT NOT NULL,
    "collection_type" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "collection_remark" TEXT NOT NULL,
    "collection_date" TEXT NOT NULL,
    "remittance_bank" TEXT NOT NULL,
    "remittance_account" TEXT NOT NULL,
    "cus_remittance_account" TEXT NOT NULL,
    "cus_remittance_bank" TEXT NOT NULL,
    "collection_complete" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "owner" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL,
    CONSTRAINT "Collection_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collection_Notice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collection_id" INTEGER NOT NULL,
    "visitDate" TEXT NOT NULL,
    "record" TEXT NOT NULL,
    "remindDate" TEXT NOT NULL,
    "remind" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Collection_Notice_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tenement_Notice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tenement_id" INTEGER NOT NULL,
    "visitDate" TEXT NOT NULL,
    "record" TEXT NOT NULL,
    "remindDate" TEXT NOT NULL,
    "remind" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "owner" INTEGER NOT NULL,
    CONSTRAINT "Tenement_Notice_tenement_id_fkey" FOREIGN KEY ("tenement_id") REFERENCES "Tenement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tenement_Notice_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "isadmin" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
