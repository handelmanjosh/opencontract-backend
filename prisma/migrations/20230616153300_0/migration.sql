/*
  Warnings:

  - Added the required column `isPublic` to the `MovementEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublic` to the `ValueEvent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MovementEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payer" TEXT,
    "payee" TEXT,
    "amount" REAL NOT NULL,
    "reward" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "rewardTokenAddress" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "time" INTEGER NOT NULL
);
INSERT INTO "new_MovementEvent" ("amount", "direction", "id", "payee", "payer", "reward", "rewardTokenAddress", "time", "tokenAddress") SELECT "amount", "direction", "id", "payee", "payer", "reward", "rewardTokenAddress", "time", "tokenAddress" FROM "MovementEvent";
DROP TABLE "MovementEvent";
ALTER TABLE "new_MovementEvent" RENAME TO "MovementEvent";
CREATE TABLE "new_ValueEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "reward" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "rewardTokenAddress" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "time" INTEGER NOT NULL
);
INSERT INTO "new_ValueEvent" ("address", "amount", "direction", "id", "reward", "rewardTokenAddress", "time", "tokenAddress") SELECT "address", "amount", "direction", "id", "reward", "rewardTokenAddress", "time", "tokenAddress" FROM "ValueEvent";
DROP TABLE "ValueEvent";
ALTER TABLE "new_ValueEvent" RENAME TO "ValueEvent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
