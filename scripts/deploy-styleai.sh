#!/bin/bash
set -e

echo "🚀 StyleAI Complete Deployment"

# Default values
STACK_NAME="styleai-stack"
ENVIRONMENT="prod"
REGION="us-east-1"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --stack-name)
      STACK_NAME="$2"
      shift 2
      ;;
    --env)
      ENVIRONMENT="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --domain)
      DOMAIN_NAME="$2"
      shift 2
      ;;
    --hosted-zone)
      HOSTED_ZONE_ID="$2"
      shift 2
      ;;
    --certificate)
      CERTIFICATE_ARN="$2"
      shift 2
      ;;
    --jwt-secret)
      JWT_SECRET="$2"
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

# Check if we're in the right directory
if [ ! -f "cloudformation/styleai-infrastructure.yml" ]; then
  echo "❌ CloudFormation template not found at cloudformation/styleai-infrastructure.yml"
  echo "Please run this script from the project root directory."
  exit 1
fi

echo "📋 Deployment Configuration:"
echo "  Stack Name: $STACK_NAME"
echo "  Environment: $ENVIRONMENT"
echo "  Region: $REGION"
if [ -n "$DOMAIN_NAME" ]; then
  echo "  Domain: $DOMAIN_NAME"
fi

# Step 1: Deploy Infrastructure
echo "🏗️  Step 1: Deploying Infrastructure..."
INFRA_ARGS="--stack-name $STACK_NAME --env $ENVIRONMENT --region $REGION"
if [ -n "$DOMAIN_NAME" ]; then
  INFRA_ARGS="$INFRA_ARGS --domain $DOMAIN_NAME"
fi
if [ -n "$HOSTED_ZONE_ID" ]; then
  INFRA_ARGS="$INFRA_ARGS --hosted-zone $HOSTED_ZONE_ID"
fi
if [ -n "$CERTIFICATE_ARN" ]; then
  INFRA_ARGS="$INFRA_ARGS --certificate $CERTIFICATE_ARN"
fi
if [ -n "$JWT_SECRET" ]; then
  INFRA_ARGS="$INFRA_ARGS --jwt-secret $JWT_SECRET"
fi

./scripts/deploy-infrastructure.sh $INFRA_ARGS

# Step 2: Deploy Backend
echo "🚀 Step 2: Deploying Backend..."
./scripts/deploy-backend.sh --stage $ENVIRONMENT --region $REGION

# Step 3: Deploy Frontend
echo "🌐 Step 3: Deploying Frontend..."
./scripts/deploy-frontend.sh --stack-name $STACK_NAME --region $REGION

# Get website URL from CloudFormation stack
WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
  --output text \
  --region "$REGION")

echo "✅ Complete deployment finished!"
echo "  Website URL: $WEBSITE_URL"
echo ""
echo "🎉 Your StyleAI application is now live!"
