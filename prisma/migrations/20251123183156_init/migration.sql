-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "rows" INTEGER NOT NULL,
    "columns" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "BoardState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    CONSTRAINT "BoardState_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BoardState_boardId_step_idx" ON "BoardState"("boardId", "step");

-- CreateIndex
CREATE INDEX "BoardState_boardId_hash_idx" ON "BoardState"("boardId", "hash");

-- CreateIndex
CREATE UNIQUE INDEX "BoardState_boardId_step_key" ON "BoardState"("boardId", "step");
