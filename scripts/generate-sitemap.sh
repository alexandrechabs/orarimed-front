#!/bin/sh

echo "Generating sitemap..."

cd /app || exit

API_URL=https://orarimed.com/api npm run generate:sitemap

echo "Sitemap generated"