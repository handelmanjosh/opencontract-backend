/*
  Warnings:

  - Added the required column `address` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bountyEventId" TEXT,
    "address" TEXT NOT NULL,
    CONSTRAINT "Address_bountyEventId_fkey" FOREIGN KEY ("bountyEventId") REFERENCES "BountyEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("bountyEventId", "id") SELECT "bountyEventId", "id" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
