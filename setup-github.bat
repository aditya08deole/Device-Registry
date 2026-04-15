@echo off
REM Script to set main as default branch and delete master
REM Usage: setup-github.bat <GITHUB_TOKEN>

if "%1"=="" (
  echo.
  echo ❌ GitHub token required
  echo Usage: setup-github.bat ^<GITHUB_TOKEN^>
  echo.
  echo To get a token:
  echo 1. Go to https://github.com/settings/tokens
  echo 2. Click 'Generate new token (classic)'
  echo 3. Select 'repo' scope
  echo 4. Copy the token and run this script with it
  echo.
  pause
  exit /b 1
)

setlocal enabledelayedexpansion
set GITHUB_TOKEN=%1
set REPO_OWNER=aditya08deole
set REPO_NAME=Device-Registry

echo.
echo 🔄 Setting main as default branch...

curl -X PATCH ^
  -H "Authorization: token %GITHUB_TOKEN%" ^
  -H "Accept: application/vnd.github.v3+json" ^
  https://api.github.com/repos/%REPO_OWNER%/%REPO_NAME% ^
  -d "{\"default_branch\":\"main\"}"

if %ERRORLEVEL% EQU 0 (
  echo ✅ Default branch set to main
) else (
  echo ❌ Failed to set default branch
  pause
  exit /b 1
)

echo.
echo 🔄 Deleting master branch...

git push origin --delete master

if %ERRORLEVEL% EQU 0 (
  echo ✅ Master branch deleted
) else (
  echo ❌ Failed to delete master branch
  pause
  exit /b 1
)

echo.
echo ✅ All done!
echo 🎉 Main branch is now default and master has been removed
echo.
pause
