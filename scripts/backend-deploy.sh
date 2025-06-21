#!/bin/bash
set -e

echo "🔧 StyleAI Backend Deployment (Using Existing Resources)"

# Check if we're in the right directory
if [ ! -f "backend/serverless.yml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check prerequisites
if ! command -v serverless &> /dev/null; then
    echo "📦 Installing Serverless Framework..."
    npm install -g serverless
fi

# Check if .env exists in backend folder
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env file with your actual values:"
    echo "   - S3_BUCKET=your-existing-bucket-name"
    echo "   - HUGGINGFACE_API_KEY=your-key"
    echo "   - EBAY_APP_ID=your-key"
    echo "   - RAPIDAPI_KEY=your-key"
    echo "   - JWT_SECRET=generate-a-strong-secret"
    echo "   - FRONTEND_URL=your-frontend-url"
    echo ""
    echo "Press Enter when ready to continue..."
    read
fi

# Load environment variables
if [ -f "backend/.env" ]; then
    export $(cat backend/.env | grep -v '^#' | xargs)
fi

# Validate required environment variables
echo "🔍 Validating configuration..."
REQUIRED_VARS=("JWT_SECRET" "S3_BUCKET" "HUGGINGFACE_API_KEY" "FRONTEND_URL")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        echo "Please set it in backend/.env file"
        exit 1
    fi
done

echo "✅ Configuration validated"

# Install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Set deployment stage
STAGE=${1:-prod}
echo "📍 Deploying backend to stage: $STAGE"

# Deploy backend to AWS Lambda
echo "🚀 Deploying backend infrastructure..."
cd backend && npx serverless deploy --stage $STAGE && cd ..

# Get API Gateway URL
API_URL=$(cd backend && npx serverless info --stage $STAGE | grep "ServiceEndpoint" | awk '{print $2}' && cd ..)

echo ""
echo "✅ Backend Deployment Complete!"
echo "📡 API URL: $API_URL"
echo "🔍 Health Check: $API_URL/health"
echo ""
echo "🧪 Test your backend:"
echo "   curl $API_URL/health"
echo ""
echo "📋 Resources Used:"
echo "   • Lambda Function: styleai-backend-$STAGE-app"
echo "   • API Gateway: styleai-backend-$STAGE"
echo "   • Existing DynamoDB Tables: StyleAI_Users, StyleAI_Wardrobe"
echo "   • Existing S3 Bucket: $S3_BUCKET"
echo ""
echo "🎯 Next Steps:"
echo "   1. Test the API endpoint above"
echo "   2. Update your frontend with this API URL"
echo "   3. Deploy your frontend to S3/CloudFront"
