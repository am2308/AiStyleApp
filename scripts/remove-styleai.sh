#!/bin/bash
set -e

echo "🗑️  StyleAI Complete Removal"

# Default values
STACK_NAME="styleai-stack"
STAGE="prod"
REGION="us-east-1"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --stack-name)
      STACK_NAME="$2"
      shift 2
      ;;
    --stage)
      STAGE="$2"
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

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
  echo "📦 Installing Serverless Framework..."
  npm install -g serverless
fi

echo "⚠️  WARNING: This will remove ALL StyleAI resources from AWS!"
echo "  Stack Name: $STACK_NAME"
echo "  Stage: $STAGE"
echo "  Region: $REGION"
echo ""
echo "This includes:"
echo "  - S3 buckets and all their contents"
echo "  - DynamoDB tables and all their data"
echo "  - Lambda functions"
echo "  - API Gateway endpoints"
echo "  - CloudFront distributions"
echo "  - IAM roles and policies"
echo ""
read -p "Are you ABSOLUTELY sure? Type 'yes' to confirm: " confirmation

if [ "$confirmation" != "yes" ]; then
  echo "❌ Removal cancelled"
  exit 1
fi

# Step 1: Empty S3 buckets (required before deleting CloudFormation stack)
echo "🗑️  Step 1: Emptying S3 buckets..."

# Get bucket names from CloudFormation stack
FRONTEND_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text \
  --region "$REGION" || echo "")

IMAGES_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='ImagesBucketName'].OutputValue" \
  --output text \
  --region "$REGION" || echo "")

if [ -n "$FRONTEND_BUCKET" ]; then
  echo "  Emptying frontend bucket: $FRONTEND_BUCKET"
  aws s3 rm s3://$FRONTEND_BUCKET --recursive --region $REGION || true
fi

if [ -n "$IMAGES_BUCKET" ]; then
  echo "  Emptying images bucket: $IMAGES_BUCKET"
  aws s3 rm s3://$IMAGES_BUCKET --recursive --region $REGION || true
fi

# Step 2: Remove Serverless deployment
echo "🗑️  Step 2: Removing Serverless deployment..."
cd backend
serverless remove --stage $STAGE --region $REGION || true
cd ..

# Step 3: Delete CloudFormation stack
echo "🗑️  Step 3: Deleting CloudFormation stack..."
aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION

echo "⏳ Waiting for CloudFormation stack deletion to complete..."
aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME --region $REGION

echo "✅ All StyleAI resources have been removed!"
