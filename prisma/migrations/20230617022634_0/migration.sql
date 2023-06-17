/*
  Warnings:

  - You are about to drop the column `isPublic` on the `ValueEvent` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `MovementEvent` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "BountyEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "numberOfContracts" INTEGER NOT NULL,
    "reward" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "rewardTokenAddress" TEXT NOT NULL,
    "time" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bountyEventId" TEXT,
    CONSTRAINT "Address_bountyEventId_fkey" FOREIGN KEY ("bountyEventId") REFERENCES "BountyEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ValueEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "reward" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "rewardTokenAddress" TEXT NOT NULL,
    "time" INTEGER NOT NULL
);
INSERT INTO "new_ValueEvent" ("address", "amount", "direction", "id", "reward", "rewardTokenAddress", "time", "tokenAddress") SELECT "address", "amount", "direction", "id", "reward", "rewardTokenAddress", "time", "tokenAddress" FROM "ValueEvent";
DROP TABLE "ValueEvent";
ALTER TABLE "new_ValueEvent" RENAME TO "ValueEvent";
CREATE TABLE "new_MovementEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payer" TEXT,
    "payee" TEXT,
    "amount" REAL NOT NULL,
    "reward" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "rewardTokenAddress" TEXT NOT NULL,
    "time" INTEGER NOT NULL
);
INSERT INTO "new_MovementEvent" ("amount", "direction", "id", "payee", "payer", "reward", "rewardTokenAddress", "time", "tokenAddress") SELECT "amount", "direction", "id", "payee", "payer", "reward", "rewardTokenAddress", "time", "tokenAddress" FROM "MovementEvent";
DROP TABLE "MovementEvent";
ALTER TABLE "new_MovementEvent" RENAME TO "MovementEvent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
