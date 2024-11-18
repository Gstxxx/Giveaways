/*
  Warnings:

  - You are about to drop the column `numbers` on the `Buyer` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "buyerId" TEXT NOT NULL,
    CONSTRAINT "Purchase_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Buyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "raffleStateId" TEXT,
    CONSTRAINT "Buyer_raffleStateId_fkey" FOREIGN KEY ("raffleStateId") REFERENCES "RaffleState" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Buyer" ("id", "name", "purchaseDate", "raffleStateId") SELECT "id", "name", "purchaseDate", "raffleStateId" FROM "Buyer";
DROP TABLE "Buyer";
ALTER TABLE "new_Buyer" RENAME TO "Buyer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
