#!/bin/bash

# Script to set main as default branch and delete master
# Usage: ./setup-github.sh <GITHUB_TOKEN>

if [ -z "$1" ]; then
  echo "❌ GitHub token required"
  echo "Usage: ./setup-github.sh <GITHUB_TOKEN>"
  echo ""
  echo "To get a token:"
  echo "1. Go to https://github.com/settings/tokens"
  echo "2. Click 'Generate new token (classic)'"
  echo "3. Select 'repo' scope"
  echo "4. Copy the token and pass it to this script"
  exit 1
fi

GITHUB_TOKEN=$1
REPO_OWNER="aditya08deole"
REPO_NAME="Device-Registry"

echo "🔄 Setting main as default branch..."

# Change default branch to main using GitHub API
curl -X PATCH \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME \
  -d '{"default_branch":"main"}' 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Default branch set to main"
else
  echo "❌ Failed to set default branch"
  exit 1
fi

echo "🔄 Deleting master branch..."

# Delete master branch
git push origin --delete master

if [ $? -eq 0 ]; then
  echo "✅ Master branch deleted"
else
  echo "❌ Failed to delete master branch"
  exit 1
fi

echo ""
echo "✅ All done!"
echo "🎉 Main branch is now default and master has been removed"
