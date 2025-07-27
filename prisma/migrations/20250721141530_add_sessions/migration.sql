/*
  Warnings:

  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sessionId` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshToken]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ipAddress` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropIndex
DROP INDEX "session_sessionId_key";

-- AlterTable
ALTER TABLE "session" DROP CONSTRAINT "session_pkey",
DROP COLUMN "sessionId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "userAgent" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "session_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "session_refreshToken_key" ON "session"("refreshToken");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
