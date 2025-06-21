#!/bin/bash
set -e

echo "🚀 StyleAI Complete Deployment (Frontend + Backend)"

# Configuration
DEPLOYMENT_TYPE="${1:-existing}"  # existing or full
STAGE="${2:-prod}"

echo "📋 Deployment Configuration:"
echo "   Type: $DEPLOYMENT_TYPE"
echo "   Stage: $STAGE"

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first"
    exit 1
fi

if ! command -v serverless &> /dev/null; then
    echo "📦 Installing Serverless Framework..."
    npm install -g serverless
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.serverless.example .env
    echo "⚠️  Please edit .env file with your API keys before continuing"
    echo "Required: JWT_SECRET, HUGGINGFACE_API_KEY, EBAY_APP_ID, RAPIDAPI_KEY"
    echo "Press Enter when ready..."
    read
fi

# Install dependencies
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    cd frontend && npm install && cd ..
fi

# Deploy Backend First
echo ""
echo "🔧 STEP 1: Deploying Backend..."
echo "=================================="
./scripts/backend-deploy.sh $STAGE

# Get backend API URL
API_URL=$(npx serverless info --stage $STAGE | grep "ServiceEndpoint" | awk '{print $2}')
export BACKEND_API_URL=$API_URL

echo "✅ Backend deployed successfully!"
echo "📡 API URL: $API_URL"

# Deploy Frontend
echo ""
echo "🌐 STEP 2: Deploying Frontend..."
echo "=================================="

if [ "$DEPLOYMENT_TYPE" = "full" ]; then
    echo "🏗️  Full frontend deployment with new infrastructure..."
    
    # Get domain configuration
    if [ -z "$DOMAIN_NAME" ]; then
        read -p "Enter your domain name (e.g., styleai.com): " DOMAIN_NAME
    fi
    if [ -z "$HOSTED_ZONE_ID" ]; then
        read -p "Enter your Route53 Hosted Zone ID: " HOSTED_ZONE_ID
    fi
    if [ -z "$CERTIFICATE_ARN" ]; then
        read -p "Enter your ACM Certificate ARN (us-east-1): " CERTIFICATE_ARN
    fi
    
    export DOMAIN_NAME HOSTED_ZONE_ID CERTIFICATE_ARN
    ./scripts/frontend-deploy-full.sh
    
    FRONTEND_URL="https://$DOMAIN_NAME"
    
elif [ "$DEPLOYMENT_TYPE" = "existing" ]; then
    echo "📦 Frontend deployment using existing S3 bucket..."
    
    if [ -z "$EXISTING_S3_BUCKET" ]; then
        read -p "Enter your existing S3 bucket name: " EXISTING_S3_BUCKET
    fi
    
    export EXISTING_S3_BUCKET
    ./scripts/frontend-deploy-existing.sh
    
    FRONTEND_URL="http://$EXISTING_S3_BUCKET.s3-website-us-east-1.amazonaws.com"
    
else
    echo "❌ Invalid deployment type. Use 'existing' or 'full'"
    exit 1
fi

echo "✅ Frontend deployed successfully!"

# Update backend with frontend URL
echo ""
echo "🔄 STEP 3: Updating Backend Configuration..."
echo "============================================="

# Update .env with frontend URL
if grep -q "FRONTEND_URL=" .env; then
    sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=$FRONTEND_URL|" .env
else
    echo "FRONTEND_URL=$FRONTEND_URL" >> .env
fi

# Redeploy backend with updated CORS
echo "🔄 Redeploying backend with updated CORS..."
export FRONTEND_URL
npx serverless deploy --stage $STAGE

echo ""
echo "🎉 COMPLETE DEPLOYMENT FINISHED!"
echo "================================="
echo ""
echo "📊 Your StyleAI Application:"
echo "   🌐 Frontend: $FRONTEND_URL"
echo "   📡 Backend API: $API_URL"
echo "   🔍 Health Check: $API_URL/health"
echo ""
echo "🧪 Test Your Deployment:"
echo "   curl $API_URL/health"
echo "   curl $FRONTEND_URL"
echo ""
echo "📋 Resources Created:"
if [ "$DEPLOYMENT_TYPE" = "full" ]; then
    echo "   • Domain: $DOMAIN_NAME"
    echo "   • CloudFront Distribution"
    echo "   • S3 Bucket with website hosting"
    echo "   • Route53 DNS records"
else
    echo "   • S3 Bucket: $EXISTING_S3_BUCKET (configured for website hosting)"
fi
echo "   • Lambda Function: styleai-backend-$STAGE-app"
echo "   • API Gateway: styleai-backend-$STAGE"
echo "   • DynamoDB Tables: users, wardrobe"
echo "   • S3 Images Bucket: styleai-backend-$STAGE-images"
echo ""
echo "🚀 Your application is ready for the hackathon!"

# Optional: Run health checks
echo ""
read -p "🔍 Run health checks? (y/n): " run_checks

if [ "$run_checks" = "y" ] || [ "$run_checks" = "Y" ]; then
    echo ""
    echo "🔍 Running Health Checks..."
    echo "============================"
    
    echo "📡 Testing Backend API..."
    if curl -s "$API_URL/health" > /dev/null; then
        echo "✅ Backend API is responding"
    else
        echo "❌ Backend API is not responding"
    fi
    
    echo "🌐 Testing Frontend..."
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo "✅ Frontend is accessible"
    else
        echo "❌ Frontend is not accessible"
    fi
    
    echo ""
    echo "🎯 Health check complete!"
fi
