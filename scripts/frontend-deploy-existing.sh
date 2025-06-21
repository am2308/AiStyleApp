#!/bin/bash
set -e

echo "🌐 StyleAI Frontend Deployment (Using Existing S3)"

# Configuration - UPDATE THESE WITH YOUR ACTUAL VALUES
EXISTING_S3_BUCKET="${EXISTING_S3_BUCKET:-your-existing-bucket-name}"
BACKEND_API_URL="${BACKEND_API_URL:-}"

if [ -z "$EXISTING_S3_BUCKET" ] || [ "$EXISTING_S3_BUCKET" = "your-existing-bucket-name" ]; then
    echo "❌ Please set EXISTING_S3_BUCKET environment variable"
    echo "Example: export EXISTING_S3_BUCKET=my-bucket-name"
    exit 1
fi

echo "📋 Using existing S3 bucket: $EXISTING_S3_BUCKET"

# Get backend API URL if not provided
if [ -z "$BACKEND_API_URL" ]; then
    echo "🔍 Getting backend API URL..."
    if command -v serverless &> /dev/null; then
        BACKEND_API_URL=$(npx serverless info --stage prod 2>/dev/null | grep "ServiceEndpoint" | awk '{print $2}' || echo "")
    fi
    
    if [ -z "$BACKEND_API_URL" ]; then
        read -p "Enter your backend API URL: " BACKEND_API_URL
    fi
fi

echo "📡 Backend API URL: $BACKEND_API_URL"

# Install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Create production environment file
echo "🔧 Configuring frontend for production..."
echo "VITE_API_URL=$BACKEND_API_URL" > frontend/.env.production

# Build frontend
echo "🏗️  Building frontend..."
cd frontend && npm run build && cd ..

# Configure S3 for static website hosting
echo "🌐 Configuring S3 for static website hosting..."
aws s3 website s3://$EXISTING_S3_BUCKET \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public read access
echo "🔓 Setting S3 bucket policy..."
aws s3api put-bucket-policy \
  --bucket $EXISTING_S3_BUCKET \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'"$EXISTING_S3_BUCKET"'/*"
      }
    ]
  }'

# Upload files to S3
echo "📤 Uploading frontend files to S3..."
aws s3 sync frontend/dist s3://$EXISTING_S3_BUCKET --delete

# Get S3 website URL
S3_WEBSITE_URL="http://$EXISTING_S3_BUCKET.s3-website-us-east-1.amazonaws.com"

echo ""
echo "✅ Frontend Deployment Complete!"
echo "🌐 Website URL: $S3_WEBSITE_URL"
echo "📡 API URL: $BACKEND_API_URL"
echo ""
echo "🧪 Test your frontend:"
echo "   curl $S3_WEBSITE_URL"
echo ""
echo "📋 Resources Used:"
echo "   • S3 Bucket: $EXISTING_S3_BUCKET"
echo "   • Website Endpoint: $S3_WEBSITE_URL"
