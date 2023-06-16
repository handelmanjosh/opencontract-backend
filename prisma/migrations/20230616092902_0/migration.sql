-- CreateTable
CREATE TABLE "MovementEvent" (
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

-- CreateTable
CREATE TABLE "ValueEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "reward" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "rewardAddress" TEXT NOT NULL,
    "time" INTEGER NOT NULL
);
