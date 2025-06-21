# 🚀 StyleAI Complete Deployment Guide

## 📁 File Organization

All deployment files are organized with clear prefixes:

### Backend Files (Prefix: `backend-` or in `scripts/backend-*`)
- `backend-serverless.yml` - Serverless configuration for backend
- `scripts/backend-deploy.sh` - Deploy backend only
- `scripts/backend-remove.sh` - Remove backend infrastructure
- `scripts/backend-logs.sh` - View backend logs

### Frontend Files (Prefix: `frontend-` or in `scripts/frontend-*`)
- `scripts/frontend-deploy-existing.sh` - Deploy to existing S3 bucket
- `scripts/frontend-deploy-full.sh` - Deploy with new infrastructure
- `scripts/frontend-remove.sh` - Remove frontend infrastructure
- `cloudformation/frontend-full-infrastructure.yml` - CloudFormation template

### Combined Deployment Files
- `scripts/deploy-all.sh` - Deploy everything together
- `scripts/remove-all.sh` - Remove everything

## 🎯 Quick Start Options

### Option 1: Using Your Existing Resources
```bash
# Set your existing resources
export EXISTING_S3_BUCKET=your-bucket-name
export BACKEND_API_URL=your-api-url  # Optional, will auto-detect

# Deploy everything
./scripts/deploy-all.sh existing
```

### Option 2: Complete New Setup
```bash
# Set your domain configuration
export DOMAIN_NAME=yourdomain.com
export HOSTED_ZONE_ID=your-zone-id
export CERTIFICATE_ARN=your-cert-arn

# Deploy everything
./scripts/deploy-all.sh full
```

### Option 3: Deploy Components Separately

#### Backend Only
```bash
./scripts/backend-deploy.sh prod
```

#### Frontend Only (Existing S3)
```bash
export EXISTING_S3_BUCKET=your-bucket
./scripts/frontend-deploy-existing.sh
```

#### Frontend Only (New Infrastructure)
```bash
export DOMAIN_NAME=yourdomain.com
export HOSTED_ZONE_ID=your-zone-id
export CERTIFICATE_ARN=your-cert-arn
./scripts/frontend-deploy-full.sh
```

## 📋 Prerequisites

### Required Tools
- AWS CLI configured (`aws configure`)
- Node.js 18+
- Serverless Framework (auto-installed)

### Required AWS Resources (for full setup)
- Domain registered
- Route53 hosted zone
- ACM SSL certificate (us-east-1 region)

### Environment Variables
Create `.env` file with:
```bash
JWT_SECRET=your-super-secret-key
HUGGINGFACE_API_KEY=your-key
EBAY_APP_ID=your-ebay-app-id
RAPIDAPI_KEY=your-rapidapi-key
```

## 🔧 Backend Deployment Details

### What Gets Created
- AWS Lambda function (Node.js 18.x)
- API Gateway with CORS
- DynamoDB tables (Users, Wardrobe)
- S3 bucket for images
- IAM roles and policies

### Commands
```bash
# Deploy backend
./scripts/backend-deploy.sh prod

# View logs
./scripts/backend-logs.sh prod tail

# Remove backend
./scripts/backend-remove.sh prod
```

### Configuration
Backend uses `backend-serverless.yml` which:
- Creates all AWS resources
- Sets up proper IAM permissions
- Configures CORS for frontend
- Enables auto-scaling

## 🌐 Frontend Deployment Details

### Deployment Options

#### Option A: Existing S3 Bucket
- Uses your existing S3 bucket
- Configures it for static website hosting
- Sets public read permissions
- Uploads built React files

#### Option B: Complete Infrastructure
- Creates new S3 bucket
- Sets up CloudFront CDN
- Configures Route53 DNS
- Enables SSL with ACM certificate

### Commands
```bash
# Using existing S3
export EXISTING_S3_BUCKET=my-bucket
./scripts/frontend-deploy-existing.sh

# Complete new setup
export DOMAIN_NAME=mysite.com
export HOSTED_ZONE_ID=Z123456
export CERTIFICATE_ARN=arn:aws:acm:...
./scripts/frontend-deploy-full.sh

# Remove frontend
./scripts/frontend-remove.sh
```

## 🎯 Combined Deployment

### Single Command Deployment
```bash
# For existing resources
./scripts/deploy-all.sh existing

# For complete new setup
./scripts/deploy-all.sh full
```

### What It Does
1. **Validates prerequisites** - Checks AWS CLI, tools
2. **Deploys backend** - Creates Lambda, DynamoDB, etc.
3. **Builds frontend** - Compiles React app with API URL
4. **Deploys frontend** - Uploads to S3 or creates infrastructure
5. **Updates configuration** - Sets CORS, environment variables
6. **Runs health checks** - Verifies everything works

### Output
```
🎉 COMPLETE DEPLOYMENT FINISHED!
📊 Your StyleAI Application:
   🌐 Frontend: https://yourdomain.com
   📡 Backend API: https://api-id.execute-api.us-east-1.amazonaws.com/prod
   🔍 Health Check: https://api-id.execute-api.us-east-1.amazonaws.com/prod/health
```

## 🛠️ Troubleshooting

### Common Issues

#### Backend Deployment Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check .env file
cat .env

# View detailed logs
./scripts/backend-logs.sh prod
```

#### Frontend Not Loading
```bash
# Check S3 bucket policy
aws s3api get-bucket-policy --bucket your-bucket

# Check website configuration
aws s3api get-bucket-website --bucket your-bucket

# Test API connectivity
curl https://your-api-url/health
```

#### CORS Errors
```bash
# Redeploy backend with correct frontend URL
export FRONTEND_URL=https://yourdomain.com
./scripts/backend-deploy.sh prod
```

### Debug Commands
```bash
# Test backend API
curl https://your-api-url/health

# Test frontend
curl https://your-frontend-url

# Check CloudFormation stacks
aws cloudformation list-stacks

# View Lambda logs
aws logs tail /aws/lambda/styleai-backend-prod-app
```

## 💰 Cost Estimation

### Monthly Costs (10K users)
- **Lambda**: $0-5 (1M requests free)
- **API Gateway**: $3.50 per million requests
- **DynamoDB**: $0-5 (25GB free tier)
- **S3**: $1-5 for storage
- **CloudFront**: $1-10 (1TB free tier)

**Total: $5-30/month** depending on usage

## 🎉 For Your Hackathon

### Quick Demo Setup
1. Use existing S3 bucket for fastest deployment
2. Deploy with: `./scripts/deploy-all.sh existing`
3. Share the S3 website URL
4. Demo is ready in 5 minutes!

### Production Setup
1. Set up domain and SSL certificate
2. Deploy with: `./scripts/deploy-all.sh full`
3. Professional URL with global CDN
4. Impresses judges with scalable architecture

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review AWS CloudWatch logs
3. Verify all environment variables
4. Ensure AWS permissions are correct

Your StyleAI application will be fully serverless, scalable, and ready for the hackathon! 🚀
