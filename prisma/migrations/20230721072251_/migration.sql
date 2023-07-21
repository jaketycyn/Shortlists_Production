/*
  Warnings:

  - You are about to drop the column `initialRank` on the `UserItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserItem" DROP COLUMN "initialRank",
ADD COLUMN "potentialRank" INTEGER NOT NULL DEFAULT 0;
