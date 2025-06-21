#!/bin/bash
set -e

echo "🌐 StyleAI Frontend Full Deployment (New Infrastructure)"

# Get configuration
DOMAIN_NAME="${DOMAIN_NAME:-}"
HOSTED_ZONE_ID="${HOSTED_ZONE_ID:-}"
CERTIFICATE_ARN="${CERTIFICATE_ARN:-}"
BACKEND_API_URL="${BACKEND_API_URL:-}"

if [ -z "$DOMAIN_NAME" ]; then
    read -p "Enter your domain name (e.g., styleai.com): " DOMAIN_NAME
fi

if [ -z "$HOSTED_ZONE_ID" ]; then
    read -p "Enter your Route53 Hosted Zone ID: " HOSTED_ZONE_ID
fi

if [ -z "$CERTIFICATE_ARN" ]; then
    read -p "Enter your ACM Certificate ARN (us-east-1): " CERTIFICATE_ARN
fi

if [ -z "$BACKEND_API_URL" ]; then
    echo "🔍 Getting backend API URL..."
    if command -v serverless &> /dev/null; then
        BACKEND_API_URL=$(npx serverless info --stage prod 2>/dev/null | grep "ServiceEndpoint" | awk '{print $2}' || echo "")
    fi
    
    if [ -z "$BACKEND_API_URL" ]; then
        read -p "Enter your backend API URL: " BACKEND_API_URL
    fi
fi

export DOMAIN_NAME HOSTED_ZONE_ID CERTIFICATE_ARN

echo ""
echo "📋 Configuration:"
echo "   Domain: $DOMAIN_NAME"
echo "   Hosted Zone: $HOSTED_ZONE_ID"
echo "   Certificate: $CERTIFICATE_ARN"
echo "   Backend API: $BACKEND_API_URL"

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

# Deploy frontend infrastructure
echo "🌐 Deploying frontend infrastructure..."
aws cloudformation deploy \
    --template-file cloudformation/frontend-infrastructure.yml \
    --stack-name styleai-frontend-prod \
    --parameter-overrides \
        DomainName=$DOMAIN_NAME \
        HostedZoneId=$HOSTED_ZONE_ID \
        CertificateArn=$CERTIFICATE_ARN \
    --capabilities CAPABILITY_IAM

# Get S3 bucket name from CloudFormation output
echo "📤 Uploading frontend files..."
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name styleai-frontend-prod \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
    --output text)

aws s3 sync frontend/dist s3://$BUCKET_NAME --delete

# Get CloudFront distribution ID and invalidate cache
echo "🔄 Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name styleai-frontend-prod \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"

echo ""
echo "✅ Frontend Full Deployment Complete!"
echo "🌐 Website URL: https://$DOMAIN_NAME"
echo "📡 API URL: $BACKEND_API_URL"
echo "☁️  CloudFront: $DISTRIBUTION_ID"
echo "🪣 S3 Bucket: $BUCKET_NAME"
echo ""
echo "⏰ Note: DNS propagation may take up to 48 hours"
echo "🧪 Test your frontend:"
echo "   curl https://$DOMAIN_NAME"
