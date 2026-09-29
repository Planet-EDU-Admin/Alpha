#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
OUTPUT=${1:-"$ROOT/dist/alfa-photobook.zip"}
STAGING=$(mktemp -d)
trap 'rm -rf "$STAGING"' EXIT

mkdir -p "$(dirname "$OUTPUT")" "$STAGING/alfa-photobook/docs"
cp "$ROOT/index.html" "$ROOT/styles.css" "$ROOT/app.js" "$ROOT/server.py" \
  "$ROOT/README.md" "$ROOT/Dockerfile" "$ROOT/.dockerignore" "$STAGING/alfa-photobook/"
cp "$ROOT/docs/BUILD_PROMPT.md" "$ROOT/docs/DEPLOYMENT.md" "$STAGING/alfa-photobook/docs/"

(cd "$STAGING" && python3 -m zipfile -c "$OUTPUT" alfa-photobook)
printf 'Created %s\n' "$OUTPUT"
