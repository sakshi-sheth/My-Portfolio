@echo off
echo 🚀 Portfolio Website Setup Script
echo =================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MySQL is not detected. Please make sure MySQL is installed and running.
    echo    You can download MySQL from: https://dev.mysql.com/downloads/
)

echo 📦 Installing dependencies...

REM Install root dependencies
npm install

REM Install frontend dependencies
cd frontend
npm install
cd ..

REM Install backend dependencies
cd backend
npm install
cd ..

echo ✅ Dependencies installed successfully!

echo.
echo 📋 Next steps:
echo 1. Make sure MySQL is running on your system
echo 2. Create a MySQL database: CREATE DATABASE portfolio_db;
echo 3. Copy backend\.env.example to backend\.env
echo 4. Update the .env file with your MySQL credentials
echo 5. Run migrations: cd backend ^&^& npm run migrate
echo 6. Start the development servers: npm run dev

echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000

pause