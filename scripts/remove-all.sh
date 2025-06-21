#!/bin/bash
set -e

echo "🗑️  StyleAI Complete Infrastructure Removal"

STAGE="${1:-prod}"

echo "⚠️  This will remove ALL StyleAI infrastructure:"
echo "   • Backend Lambda functions"
echo "   • API Gateway"
echo "   • DynamoDB tables (ALL DATA WILL BE LOST!)"
echo "   • S3 buckets (ALL FILES WILL BE LOST!)"
echo "   • Frontend CloudFront distribution"
echo "   • Route53 DNS records"
echo ""
echo "Stage: $STAGE"
echo ""
read -p "Are you ABSOLUTELY sure? Type 'DELETE-EVERYTHING' to continue: " confirm

if [ "$confirm" != "DELETE-EVERYTHING" ]; then
    echo "❌ Removal cancelled"
    exit 1
fi

echo ""
echo "🗑️  Removing Frontend Infrastructure..."
echo "======================================"
./scripts/frontend-remove.sh

echo ""
echo "🗑️  Removing Backend Infrastructure..."
echo "====================================="
./scripts/backend-remove.sh $STAGE

echo ""
echo "✅ Complete infrastructure removal finished!"
echo ""
echo "🧹 Cleanup complete. All resources have been removed."
