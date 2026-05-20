#!/bin/sh

echo "Generating sitemap..."

wget -qO /usr/share/nginx/html/sitemap.xml \
  https://orarimed.com/api/sitemap

echo "Sitemap generated"