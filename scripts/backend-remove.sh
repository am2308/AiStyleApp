#!/bin/bash
set -e

echo "🗑️  StyleAI Backend Removal"

STAGE=${1:-dev}
echo "⚠️  This will remove ALL backend resources for stage: $STAGE"
echo "   • Lambda functions"
echo "   • API Gateway"
echo "   • DynamoDB tables (DATA WILL BE LOST!)"
echo "   • S3 bucket (IMAGES WILL BE LOST!)"
echo ""
read -p "Are you sure? Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Removal cancelled"
    exit 1
fi

echo "🗑️  Removing backend infrastructure..."
npx serverless remove --stage $STAGE

echo "✅ Backend removal complete!"
