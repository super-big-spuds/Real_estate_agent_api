/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `tenement_info` (
    `tenement_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `tenement_no` INTEGER NOT NULL,
    `tenement_face` VARCHAR(191) NOT NULL,
    `Total_rating` INTEGER NOT NULL,
    `main_building` INTEGER NOT NULL,
    `affiliated_building` INTEGER NOT NULL,
    `public_buliding` INTEGER NOT NULL,
    `management_fee` INTEGER NOT NULL,
    `tenement_status` INTEGER NOT NULL,
    `tenement_type` INTEGER NOT NULL,
    `tenement_photo` JSON NOT NULL,
    `tenement_floor` INTEGER NOT NULL,
    `tenement_style` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tenement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rent_notice` (
    `rent_id` INTEGER NOT NULL,
    `rent_record` VARCHAR(191) NOT NULL,
    `rent_notice` VARCHAR(191) NOT NULL,
    `visit_date` DATETIME(3) NOT NULL,
    `notice_date` DATETIME(3) NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`rent_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sell_notice` (
    `sell_id` INTEGER NOT NULL,
    `sell_record` VARCHAR(191) NOT NULL,
    `sell_notice` VARCHAR(191) NOT NULL,
    `visit_date` DATETIME(3) NOT NULL,
    `notice_date` DATETIME(3) NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`sell_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `develop_notice` (
    `develop_id` INTEGER NOT NULL,
    `develop_record` VARCHAR(191) NOT NULL,
    `develop_feedback` VARCHAR(191) NOT NULL,
    `visit_date` DATETIME(3) NOT NULL,
    `notice_date` DATETIME(3) NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`develop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `market_notice` (
    `market_id` INTEGER NOT NULL,
    `market_hint` VARCHAR(191) NOT NULL,
    `market_remark` VARCHAR(191) NOT NULL,
    `market_content` VARCHAR(191) NOT NULL,
    `market_responses` VARCHAR(191) NOT NULL,
    `market_date` DATETIME(3) NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`market_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rent_info` (
    `rent_id` INTEGER NOT NULL,
    `owner_name` VARCHAR(191) NOT NULL,
    `owner_phone` VARCHAR(191) NOT NULL,
    `owner_telephone` VARCHAR(191) NOT NULL,
    `owner_line` VARCHAR(191) NOT NULL,
    `owner_remittance` VARCHAR(191) NOT NULL,
    `rental` INTEGER NOT NULL,
    `deposit` INTEGER NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`rent_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sell_info` (
    `sell_id` INTEGER NOT NULL,
    `owner_name` VARCHAR(191) NOT NULL,
    `owner_phone` VARCHAR(191) NOT NULL,
    `owner_telephone` VARCHAR(191) NOT NULL,
    `owner_line` VARCHAR(191) NOT NULL,
    `owner_remittance` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`sell_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `develop_info` (
    `develop_id` INTEGER NOT NULL,
    `owner_name` VARCHAR(191) NOT NULL,
    `owner_phone` VARCHAR(191) NOT NULL,
    `owner_telephone` VARCHAR(191) NOT NULL,
    `owner_line` VARCHAR(191) NOT NULL,
    `owner_remittance` VARCHAR(191) NOT NULL,
    `rental` INTEGER NOT NULL,
    `deposit` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`develop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `market_info` (
    `market_id` INTEGER NOT NULL,
    `owner_name` VARCHAR(191) NOT NULL,
    `owner_phone` VARCHAR(191) NOT NULL,
    `owner_telephone` VARCHAR(191) NOT NULL,
    `owner_line` VARCHAR(191) NOT NULL,
    `owner_demand` VARCHAR(191) NOT NULL,
    `owner_want` VARCHAR(191) NOT NULL,
    `min_budget` INTEGER NOT NULL,
    `max_budget` INTEGER NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`market_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buyer_info` (
    `buyer_id` INTEGER NOT NULL,
    `order_date` VARCHAR(191) NOT NULL,
    `delivery_date` VARCHAR(191) NOT NULL,
    `buyer_name` VARCHAR(191) NOT NULL,
    `buyer_phone` VARCHAR(191) NOT NULL,
    `buyer_jobtitle` VARCHAR(191) NOT NULL,
    `buyer_idcard_image` JSON NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`buyer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `renter_info` (
    `renter_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `renter_name` VARCHAR(191) NOT NULL,
    `renter_phone` VARCHAR(191) NOT NULL,
    `renter_jobtitle` VARCHAR(191) NOT NULL,
    `guarantor_name` VARCHAR(191) NOT NULL,
    `guarantor_phone` VARCHAR(191) NOT NULL,
    `renter_idcard_image` JSON NOT NULL,
    `renter_agreement` VARCHAR(191) NOT NULL,
    `tenement_id` INTEGER NOT NULL,

    PRIMARY KEY (`renter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collection_info` (
    `collection_id` INTEGER NOT NULL,
    `tenement_id` INTEGER NOT NULL,
    `collection_name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `payment` INTEGER NOT NULL,
    `collection_remark` VARCHAR(191) NOT NULL,
    `remittance_bank` VARCHAR(191) NOT NULL,
    `remittance_account` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`collection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collection_notice` (
    `notice_id` INTEGER NOT NULL,
    `collection_id` INTEGER NOT NULL,
    `collection_record` VARCHAR(191) NOT NULL,
    `collection_notice` VARCHAR(191) NOT NULL,
    `visit_date` DATETIME(3) NOT NULL,
    `notice_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`notice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_password` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tenement_info` ADD CONSTRAINT `tenement_info_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rent_notice` ADD CONSTRAINT `rent_notice_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sell_notice` ADD CONSTRAINT `sell_notice_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `develop_notice` ADD CONSTRAINT `develop_notice_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `market_notice` ADD CONSTRAINT `market_notice_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rent_info` ADD CONSTRAINT `rent_info_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sell_info` ADD CONSTRAINT `sell_info_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `develop_info` ADD CONSTRAINT `develop_info_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `market_info` ADD CONSTRAINT `market_info_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buyer_info` ADD CONSTRAINT `buyer_info_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `renter_info` ADD CONSTRAINT `renter_info_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collection_info` ADD CONSTRAINT `collection_info_tenement_id_fkey` FOREIGN KEY (`tenement_id`) REFERENCES `tenement_info`(`tenement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collection_notice` ADD CONSTRAINT `collection_notice_collection_id_fkey` FOREIGN KEY (`collection_id`) REFERENCES `collection_info`(`collection_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
