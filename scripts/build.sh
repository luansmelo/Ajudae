#!/bin/sh
echo "Generating Prisma client..."
npx prisma generate

echo "Building the NestJS app..."
npm run build