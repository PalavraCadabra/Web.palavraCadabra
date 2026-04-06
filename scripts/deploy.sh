#!/bin/bash
# Deploy script for Palavra Cadabra Web Portal
# Builds, uploads to S3, creates dynamic route copies, and invalidates CloudFront
set -e

S3_BUCKET="palavracadabra-dev-web"
CF_DISTRIBUTION="E1JD6C88YRK9YO"
API_URL="${API_URL:-https://api.palavracadabra.com.br}"

echo "=== Building Next.js ==="
npm run build

echo ""
echo "=== Uploading to S3 ==="
aws s3 sync out/ "s3://$S3_BUCKET/" --delete

echo ""
echo "=== Creating dynamic route copies ==="
# For each patient profile, copy the placeholder page to their UUID path
# This is needed because static export can't pre-render all possible UUIDs

# Login as admin to get all profiles
TOKEN=$(curl -s -X POST "$API_URL/api/v1/auth/login" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "username=${ADMIN_EMAIL:-admin@palavracadabra.edu.br}&password=${ADMIN_PASSWORD:-Admin2026!}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))")

if [ -n "$TOKEN" ] && [ "$TOKEN" != "" ]; then
  # Get all profiles
  PROFILE_IDS=$(curl -s "$API_URL/api/v1/profiles/" \
    -H "Authorization: Bearer $TOKEN" \
    | python3 -c "import sys,json; [print(p['id']) for p in json.load(sys.stdin)]" 2>/dev/null)

  for pid in $PROFILE_IDS; do
    echo "  Copying patient detail for $pid"
    aws s3 sync "s3://$S3_BUCKET/dashboard/patients/placeholder/" \
      "s3://$S3_BUCKET/dashboard/patients/$pid/" --quiet
  done

  # Get all board IDs
  BOARD_IDS=$(curl -s "$API_URL/api/v1/boards/" \
    -H "Authorization: Bearer $TOKEN" \
    | python3 -c "import sys,json; [print(b['id']) for b in json.load(sys.stdin)]" 2>/dev/null)

  for bid in $BOARD_IDS; do
    echo "  Copying board detail for $bid"
    aws s3 sync "s3://$S3_BUCKET/dashboard/boards/placeholder/" \
      "s3://$S3_BUCKET/dashboard/boards/$bid/" --quiet
  done

  echo "  Dynamic routes created."
else
  echo "  WARNING: Could not login to API. Dynamic routes not created."
fi

echo ""
echo "=== Invalidating CloudFront ==="
aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION" --paths "/*" \
  --query 'Invalidation.Status' --output text

echo ""
echo "=== Done! ==="
echo "Portal: https://www.palavracadabra.com.br"
