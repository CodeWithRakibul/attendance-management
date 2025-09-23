@echo off
echo Setting up database with Bogura coaching center data...
echo.

echo 1. Generating Prisma client...
npm run db:generate

echo.
echo 2. Pushing database schema...
npm run db:push

echo.
echo 3. Seeding database with dummy data...
npm run db:seed

echo.
echo ✅ Database setup complete!
echo You can now run: npm run dev
pause