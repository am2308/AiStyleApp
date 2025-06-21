#!/bin/bash
set -e

echo "🗑️  StyleAI Frontend Infrastructure Removal"

STACK_NAME="styleai-frontend-prod"

echo "⚠️  This will remove ALL frontend infrastructure:"
echo "   • S3 bucket and all files"
echo "   • CloudFront distribution"
echo "   • Route53 DNS records"
echo ""
read -p "Are you sure? Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Removal cancelled"
    exit 1
fi

# Get bucket name before deletion
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -n "$BUCKET_NAME" ]; then
    echo "🗑️  Emptying S3 bucket: $BUCKET_NAME"
    aws s3 rm s3://$BUCKET_NAME --recursive
fi

echo "🗑️  Removing CloudFormation stack..."
aws cloudformation delete-stack --stack-name $STACK_NAME

echo "⏳ Waiting for stack deletion to complete..."
aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME

echo "✅ Frontend infrastructure removal complete!"
