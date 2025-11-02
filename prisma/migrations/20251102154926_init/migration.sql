-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "socketId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "roomId" TEXT NOT NULL,
    "playerRedId" INTEGER,
    "playerBlackId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "moves" JSONB,
    "currentPlayer" TEXT NOT NULL DEFAULT 'red',
    "winnerColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Game_roomId_key" ON "Game"("roomId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerRedId_fkey" FOREIGN KEY ("playerRedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerBlackId_fkey" FOREIGN KEY ("playerBlackId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
