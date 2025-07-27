/*
  Warnings:

  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `session` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "session" DROP CONSTRAINT "session_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "ipAddress" DROP NOT NULL,
ALTER COLUMN "userAgent" DROP NOT NULL,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");
