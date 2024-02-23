/*
  Warnings:

  - You are about to drop the column `userId` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Home` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `About` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Home` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[copy_email]` on the table `Home` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_title` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `copy_email` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_name` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "About" DROP CONSTRAINT "About_userId_fkey";

-- DropForeignKey
ALTER TABLE "Home" DROP CONSTRAINT "Home_userId_fkey";

-- DropIndex
DROP INDEX "About_userId_key";

-- DropIndex
DROP INDEX "Home_userId_key";

-- AlterTable
ALTER TABLE "About" DROP COLUMN "userId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "sub_title" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Home" DROP COLUMN "userId",
ADD COLUMN     "copy_email" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "logo_name" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "AboutMe" (
    "id" SERIAL NOT NULL,
    "about_id" INTEGER,
    "about_me_title" TEXT,
    "about_me_description" TEXT,

    CONSTRAINT "AboutMe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Languages" (
    "id" SERIAL NOT NULL,
    "subTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguagesItem" (
    "id" SERIAL NOT NULL,
    "languages_id" INTEGER,
    "image" TEXT NOT NULL,
    "language_name" TEXT NOT NULL,

    CONSTRAINT "LanguagesItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whyMe" (
    "id" SERIAL NOT NULL,
    "subTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "whyMe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whyMeItems" (
    "id" SERIAL NOT NULL,
    "why_me_id" INTEGER,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "whyMeItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "subtitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "work_links" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workItems" (
    "id" SERIAL NOT NULL,
    "workId" INTEGER,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sub_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "workItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "More" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sub_title" TEXT NOT NULL,
    "links" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "More_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Languages_user_id_key" ON "Languages"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "whyMe_user_id_key" ON "whyMe"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Work_user_id_key" ON "Work"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "More_user_id_key" ON "More"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "About_user_id_key" ON "About"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Home_user_id_key" ON "Home"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Home_copy_email_key" ON "Home"("copy_email");

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "About" ADD CONSTRAINT "About_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutMe" ADD CONSTRAINT "AboutMe_about_id_fkey" FOREIGN KEY ("about_id") REFERENCES "About"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Languages" ADD CONSTRAINT "Languages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguagesItem" ADD CONSTRAINT "LanguagesItem_languages_id_fkey" FOREIGN KEY ("languages_id") REFERENCES "Languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whyMe" ADD CONSTRAINT "whyMe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whyMeItems" ADD CONSTRAINT "whyMeItems_why_me_id_fkey" FOREIGN KEY ("why_me_id") REFERENCES "whyMe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workItems" ADD CONSTRAINT "workItems_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "More" ADD CONSTRAINT "More_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
