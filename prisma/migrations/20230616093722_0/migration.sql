/*
  Warnings:

  - You are about to drop the column `rewardAddress` on the `ValueEvent` table. All the data in the column will be lost.
  - Added the required column `rewardTokenAddress` to the `ValueEvent` table without a default value. This is not possible if the table is not empty.

*/
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
INSERT INTO "new_ValueEvent" ("address", "amount", "direction", "id", "reward", "time", "tokenAddress") SELECT "address", "amount", "direction", "id", "reward", "time", "tokenAddress" FROM "ValueEvent";
DROP TABLE "ValueEvent";
ALTER TABLE "new_ValueEvent" RENAME TO "ValueEvent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
