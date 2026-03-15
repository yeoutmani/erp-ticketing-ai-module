#!/bin/bash
set -e

N8N_URL="${N8N_URL:-http://localhost:5678}"
N8N_USER="${N8N_BASIC_AUTH_USER:-admin}"
N8N_PASS="${N8N_BASIC_AUTH_PASSWORD}"
WORKFLOWS_DIR="./infra/n8n/workflows"

echo "⏳ Waiting for n8n to be ready..."
until curl -s -u "$N8N_USER:$N8N_PASS" "$N8N_URL/api/v1/workflows" > /dev/null 2>&1; do
  sleep 2
done
echo "✅ n8n is up"

echo "📦 Importing workflows..."
for file in "$WORKFLOWS_DIR"/*.json; do
  name=$(basename "$file")
  echo "  → $name"
  curl -s -X POST "$N8N_URL/api/v1/workflows" \
    -u "$N8N_USER:$N8N_PASS" \
    -H "Content-Type: application/json" \
    -d @"$file" > /dev/null
done

echo "✅ All workflows imported"