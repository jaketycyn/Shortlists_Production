/*
  Warnings:

  - You are about to drop the column `potentialRank` on the `UserItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserItem" DROP COLUMN "potentialRank",
ADD COLUMN     "initialRank" INTEGER NOT NULL DEFAULT 0;
