-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "numbers" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "raffleStateId" TEXT,
    CONSTRAINT "Buyer_raffleStateId_fkey" FOREIGN KEY ("raffleStateId") REFERENCES "RaffleState" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Winner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "drawDate" DATETIME NOT NULL,
    "raffleStateId" TEXT,
    CONSTRAINT "Winner_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Winner_raffleStateId_fkey" FOREIGN KEY ("raffleStateId") REFERENCES "RaffleState" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaffleState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalNumbers" INTEGER NOT NULL
);
