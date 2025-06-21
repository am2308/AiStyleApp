# 🌐 Frontend Serverless Deployment Guide

## 📋 How Frontend "Serverless" Works

The frontend isn't deployed on Lambda - it's deployed as a **static website** using:
- **S3** for hosting static files (HTML, CSS, JS)
- **CloudFront** as global CDN for fast delivery
- **Route53** for custom domain routing
- **ACM** for SSL certificates

This is considered "serverless" because:
- No servers to manage
- Auto-scaling globally
- Pay only for usage
- Zero maintenance

## 🎯 Scenario 1: Using Your Existing Resources

Since you already have DynamoDB tables and S3 bucket, here's how to deploy:

### Step 1: Prepare Your Environment
```bash
# Set your existing resource names
export EXISTING_S3_BUCKET=your-existing-bucket-name
export EXISTING_DOMAIN=your-domain.com
export HOSTED_ZONE_ID=your-route53-zone-id
export CERTIFICATE_ARN=your-acm-certificate-arn
```

### Step 2: Build Frontend
```bash
cd frontend
npm install
npm run build
```

### Step 3: Deploy to Your Existing S3 Bucket
```bash
# Upload built files to your existing S3 bucket
aws s3 sync frontend/dist s3://$EXISTING_S3_BUCKET --delete

# Enable static website hosting
aws s3 website s3://$EXISTING_S3_BUCKET \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public read
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
```

### Step 4: Deploy Backend (Using Existing DynamoDB)
```bash
# Update serverless.yml to use existing tables
# Edit serverless.yml and comment out the DynamoDB resources section
# Set environment variables to point to existing tables

export USERS_TABLE=your-existing-users-table
export WARDROBE_TABLE=your-existing-wardrobe-table

# Deploy backend
npx serverless deploy --stage prod
```

### Step 5: Setup CloudFront (Optional but Recommended)
```bash
# Create CloudFront distribution for better performance
aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "styleai-'$(date +%s)'",
    "Aliases": {
      "Quantity": 1,
      "Items": ["'$EXISTING_DOMAIN'"]
    },
    "DefaultRootObject": "index.html",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "S3Origin",
          "DomainName": "'$EXISTING_S3_BUCKET'.s3.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3Origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "MinTTL": 0,
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      }
    },
    "Comment": "StyleAI Frontend Distribution",
    "Enabled": true
  }'
```

## 🚀 Scenario 2: Complete Setup From Scratch

For someone setting up for the first time:

### Step 1: Prerequisites
```bash
# Install required tools
npm install -g serverless
pip install awscli

# Configure AWS credentials
aws configure
```

### Step 2: Domain and SSL Setup
```bash
# 1. Register domain (manual step via AWS Console or registrar)

# 2. Create Route53 hosted zone
aws route53 create-hosted-zone \
  --name yourdomain.com \
  --caller-reference $(date +%s)

# 3. Get hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones \
  --query 'HostedZones[?Name==`yourdomain.com.`].Id' \
  --output text | cut -d'/' -f3)

# 4. Request SSL certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names "*.yourdomain.com" \
  --validation-method DNS \
  --region us-east-1

# 5. Get certificate ARN
CERTIFICATE_ARN=$(aws acm list-certificates \
  --region us-east-1 \
  --query 'CertificateSummaryList[?DomainName==`yourdomain.com`].CertificateArn' \
  --output text)
```

### Step 3: Backend Infrastructure Setup
```bash
# Clone and setup project
git clone your-repo
cd styleai

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Create .env file
cp .env.serverless.example .env
# Edit .env with your API keys

# Deploy backend (creates DynamoDB tables automatically)
npx serverless deploy --stage prod
```

### Step 4: Frontend Infrastructure Setup
```bash
# Set environment variables
export DOMAIN_NAME=yourdomain.com
export HOSTED_ZONE_ID=your-hosted-zone-id
export CERTIFICATE_ARN=your-certificate-arn

# Deploy frontend infrastructure
aws cloudformation deploy \
  --template-file cloudformation/frontend-infrastructure.yml \
  --stack-name styleai-frontend-prod \
  --parameter-overrides \
    DomainName=$DOMAIN_NAME \
    HostedZoneId=$HOSTED_ZONE_ID \
    CertificateArn=$CERTIFICATE_ARN \
  --capabilities CAPABILITY_IAM
```

### Step 5: Build and Deploy Frontend
```bash
# Get API Gateway URL from backend deployment
API_URL=$(npx serverless info --stage prod | grep "ServiceEndpoint" | awk '{print $2}')

# Update frontend environment
echo "VITE_API_URL=$API_URL" > frontend/.env.production

# Build frontend
cd frontend && npm run build && cd ..

# Get S3 bucket name from CloudFormation
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name styleai-frontend-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text)

# Upload to S3
aws s3 sync frontend/dist s3://$BUCKET_NAME --delete

# Get CloudFront distribution ID
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name styleai-frontend-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

## 🛠️ Quick Setup Scripts

### For Existing Resources (quick-deploy-existing.sh)
```bash
#!/bin/bash
set -e

echo "🚀 Quick Deploy with Existing Resources"

# Configuration
EXISTING_S3_BUCKET="your-existing-bucket"
EXISTING_USERS_TABLE="your-existing-users-table"
EXISTING_WARDROBE_TABLE="your-existing-wardrobe-table"

# Build frontend
echo "📦 Building frontend..."
cd frontend && npm install && npm run build && cd ..

# Deploy backend with existing tables
echo "🔧 Deploying backend..."
export USERS_TABLE=$EXISTING_USERS_TABLE
export WARDROBE_TABLE=$EXISTING_WARDROBE_TABLE
npx serverless deploy --stage prod

# Upload frontend to existing S3
echo "📤 Uploading frontend..."
aws s3 sync frontend/dist s3://$EXISTING_S3_BUCKET --delete

echo "✅ Deployment complete!"
echo "Frontend: http://$EXISTING_S3_BUCKET.s3-website-us-east-1.amazonaws.com"
```

### For Complete Setup (full-setup.sh)
```bash
#!/bin/bash
set -e

echo "🚀 Complete StyleAI Setup"

# Check prerequisites
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

if ! command -v serverless &> /dev/null; then
    echo "📦 Installing Serverless Framework..."
    npm install -g serverless
fi

# Environment setup
read -p "Enter your domain name (e.g., styleai.com): " DOMAIN_NAME
read -p "Enter your Route53 Hosted Zone ID: " HOSTED_ZONE_ID
read -p "Enter your ACM Certificate ARN: " CERTIFICATE_ARN

export DOMAIN_NAME HOSTED_ZONE_ID CERTIFICATE_ARN

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..

# Deploy backend
echo "🔧 Deploying backend infrastructure..."
npx serverless deploy --stage prod

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

# Build and deploy frontend
echo "🏗️ Building and deploying frontend..."
API_URL=$(npx serverless info --stage prod | grep "ServiceEndpoint" | awk '{print $2}')
echo "VITE_API_URL=$API_URL" > frontend/.env.production

cd frontend && npm run build && cd ..

BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name styleai-frontend-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text)

aws s3 sync frontend/dist s3://$BUCKET_NAME --delete

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name styleai-frontend-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo ""
echo "🎉 Deployment Complete!"
echo "Frontend URL: https://$DOMAIN_NAME"
echo "Backend API: $API_URL"
echo ""
echo "⏰ Note: DNS propagation may take up to 48 hours"
```

## 📊 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Route53       │    │   CloudFront     │    │      S3         │
│  (DNS Routing)  │───▶│   (Global CDN)   │───▶│ (Static Files)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Lambda         │    │   DynamoDB      │
│  (API Routing)  │───▶│  (Backend API)   │───▶│   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │       S3        │
                       │ (Image Storage) │
                       └─────────────────┘
```

## 💰 Cost Breakdown

### Monthly Costs (estimated for 10K users):
- **S3 Storage**: $1-5
- **CloudFront**: $1-10 (1TB free tier)
- **Lambda**: $0-5 (1M requests free)
- **API Gateway**: $3.50 per million requests
- **DynamoDB**: $0-5 (25GB free tier)
- **Route53**: $0.50 per hosted zone

**Total: $5-30/month** depending on usage

## 🔧 Troubleshooting

### Common Issues:

1. **Certificate not found**
   - Ensure certificate is in us-east-1 region
   - Wait for DNS validation to complete

2. **S3 bucket access denied**
   - Check bucket policy allows public read
   - Verify bucket name is globally unique

3. **CloudFront not serving updated files**
   - Create invalidation for "/*"
   - Wait 5-15 minutes for propagation

4. **API Gateway CORS errors**
   - Check serverless.yml CORS configuration
   - Verify frontend URL in environment variables

### Debug Commands:
```bash
# Check S3 bucket website configuration
aws s3api get-bucket-website --bucket your-bucket-name

# Test API endpoint
curl https://your-api-domain.com/health

# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name styleai-frontend-prod

# View Lambda logs
npx serverless logs -f app --stage prod --tail
```

## 🎯 For Your Hackathon

Since you already have the infrastructure, use **Scenario 1** for quick deployment:

1. Build frontend: `cd frontend && npm run build`
2. Upload to S3: `aws s3 sync frontend/dist s3://your-bucket --delete`
3. Deploy backend: `npx serverless deploy --stage prod`
4. Test everything works
5. Share the S3 website URL or CloudFront URL

This gives you a fully functional, scalable application perfect for your hackathon demo! 🚀
