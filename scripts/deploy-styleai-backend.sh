#!/bin/bash
set -e

echo "🚀 StyleAI Backend Deployment"

# Default values
STAGE="prod"
REGION="us-east-1"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
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

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
  echo "📦 Installing Serverless Framework..."
  npm install -g serverless
fi

# Check if we're in the right directory
if [ ! -f "backend/serverless.yml" ]; then
  echo "❌ serverless.yml not found in backend directory"
  echo "Please run this script from the project root directory."
  exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
  echo "❌ .env file not found in backend directory"
  echo "Please run deploy-infrastructure.sh first or create the .env file manually."
  exit 1
fi

echo "📋 Deployment Configuration:"
echo "  Stage: $STAGE"
echo "  Region: $REGION"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Deploy using Serverless Framework
echo "🚀 Deploying backend..."
serverless deploy --stage $STAGE --region $REGION

# Get API Gateway URL
API_URL=$(serverless info --stage $STAGE --verbose | grep "ServiceEndpoint" | sed 's/  ServiceEndpoint: //g')

echo "✅ Backend deployment complete!"
echo "  API URL: $API_URL"

# Update frontend .env.production with API URL
cd ..
if [ -f "frontend/.env.production" ]; then
  echo "📝 Updating frontend/.env.production with API URL..."
  sed -i.bak "s|VITE_API_URL=.*|VITE_API_URL=$API_URL|g" frontend/.env.production
  rm -f frontend/.env.production.bak
  echo "✅ frontend/.env.production updated"
fi

echo ""
echo "🚀 Next steps:"
echo "  1. Deploy the frontend: ./scripts/deploy-frontend.sh"
