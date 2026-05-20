#!/bin/sh

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Generating sitemap..."

wget -qO /usr/share/nginx/html/sitemap.xml \
https://orarimed.com/api/sitemap

log "Sitemap generated"