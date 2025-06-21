# 🚀 StyleAI Hackathon Deployment Commands

## Quick Deployment for Demo

### 1. Environment Setup
```bash
# Set your domain variables
export DOMAIN_NAME=styleai-demo.com
export HOSTED_ZONE_ID=Z1234567890ABC
export CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789:certificate/abc-123

# Set API keys in .env file
cp .env.serverless.example .env
# Edit .env with your actual API keys
```

### 2. One-Command Deployment
```bash
# Deploy everything to production
./scripts/deploy.sh prod
```

### 3. Local Development (Backup)
```bash
# Start local development environment
./scripts/local-dev.sh
```

## Manual Deployment Steps

### Backend Deployment
```bash
# Install dependencies
npm install

# Deploy serverless backend
npx serverless deploy --stage prod

# Check deployment status
npx serverless info --stage prod
```

### Frontend Deployment
```bash
# Install frontend dependencies
cd frontend && npm install

# Build for production
npm run build

# Deploy infrastructure
aws cloudformation deploy \
  --template-file ../cloudformation/frontend-infrastructure.yml \
  --stack-name styleai-frontend-prod \
  --parameter-overrides \
    DomainName=$DOMAIN_NAME \
    HostedZoneId=$HOSTED_ZONE_ID \
    CertificateArn=$CERTIFICATE_ARN

# Upload files to S3
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name styleai-frontend-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text)

aws s3 sync dist s3://$BUCKET_NAME --delete

# Invalidate CloudFront cache
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name styleai-frontend-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

## Demo Environment URLs

After deployment, your app will be available at:
- **Frontend**: https://styleai-demo.com
- **Backend API**: https://api.styleai-demo.com
- **Health Check**: https://api.styleai-demo.com/health

## Troubleshooting

### Common Issues
```bash
# Check Lambda logs
npx serverless logs -f app --stage prod --tail

# Test API endpoint
curl https://api.styleai-demo.com/health

# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name styleai-frontend-prod
```

### Rollback Commands
```bash
# Remove serverless deployment
npx serverless remove --stage prod

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name styleai-frontend-prod
```

## Cost Optimization

### Estimated Monthly Costs
- **Lambda**: $0-5 (1M requests free)
- **API Gateway**: $3.50 per million requests
- **DynamoDB**: $0-5 (25GB free tier)
- **S3**: $1-5 for storage
- **CloudFront**: $1-10 (1TB free tier)

**Total: $5-30/month** depending on usage

### Cost Monitoring
```bash
# Check AWS costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```
