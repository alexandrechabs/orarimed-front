#!/bin/sh

echo "Generating sitemap..."

cd /usr/share/nginx/html || exit

API_URL=https://orarimed.com/api npm run generate:sitemap

echo "Sitemap generated"