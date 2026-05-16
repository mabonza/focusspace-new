#!/bin/bash
set -e

echo "=== Focus Space Deployment ==="

APP_DIR=/home/535924.cloudwaysapps.com/vyhjbmcqgj/public_html

# Move to public_html
cd "$APP_DIR"

echo "--- Cloning repository ---"
# Remove old files if any
rm -rf .git src backend frontend docker* README* deploy*

# Clone the repo
git clone https://github.com/mabonza/focusspace-new.git tmp_clone
# Move contents out
shopt -s dotglob
cp -r tmp_clone/* .
rm -rf tmp_clone

echo "--- Setting up backend ---"
cd "$APP_DIR/backend"

# Install dependencies
echo "--- Installing dependencies (this takes ~2 mins) ---"
npm install

# Create .env from uploaded file
if [ -f "$APP_DIR/.env.production" ]; then
  cp "$APP_DIR/.env.production" .env
  echo ".env copied"
fi

# Admin panel is pre-built locally — skip build on server to save RAM

# Start with PM2
echo "--- Starting with PM2 ---"
pm2 delete focusspace-backend 2>/dev/null || true
pm2 start npm --name "focusspace-backend" -- run start
pm2 save

echo ""
echo "=== DONE! Strapi is running on port 1337 ==="
echo "Admin panel: https://admin.focusspace.co.za/admin"
