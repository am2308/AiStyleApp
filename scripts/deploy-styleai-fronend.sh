#!/bin/bash
set -e

echo "🚀 StyleAI Frontend Deployment"

# Default values
STACK_NAME="styleai-stack"
REGION="us-east-1"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --stack-name)
      STACK_NAME="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
  echo "❌ frontend directory not found"
  echo "Please run this script from the project root directory."
  exit 1
fi

# Check if .env.production file exists
if [ ! -f "frontend/.env.production" ]; then
  echo "❌ .env.production file not found in frontend directory"
  echo "Please run deploy-infrastructure.sh and deploy-backend.sh first or create the file manually."
  exit 1
fi

# Get S3 bucket name from CloudFormation stack
echo "🔍 Getting S3 bucket name from CloudFormation stack..."
FRONTEND_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text \
  --region "$REGION")

if [ -z "$FRONTEND_BUCKET" ]; then
  echo "❌ Failed to get frontend bucket name from CloudFormation stack"
  echo "Please make sure the stack exists and has the expected outputs."
  exit 1
fi

# Get CloudFront distribution ID from CloudFormation stack
echo "🔍 Getting CloudFront distribution ID from CloudFormation stack..."
CLOUDFRONT_DISTRIBUTION=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text \
  --region "$REGION")

echo "📋 Deployment Configuration:"
echo "  S3 Bucket: $FRONTEND_BUCKET"
echo "  CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🏗️  Building frontend..."
npm run build

# Upload to S3
echo "📤 Uploading to S3 bucket..."
aws s3 sync dist s3://$FRONTEND_BUCKET --delete --region $REGION

# Invalidate CloudFront cache
if [ -n "$CLOUDFRONT_DISTRIBUTION" ]; then
  echo "🔄 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION \
    --paths "/*" \
    --region $REGION
fi

# Get website URL from CloudFormation stack
WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
  --output text \
  --region "$REGION")

echo "✅ Frontend deployment complete!"
echo "  Website URL: $WEBSITE_URL"
