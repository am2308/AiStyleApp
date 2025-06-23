# StyleAI Serverless Deployment Guide

This guide will help you deploy StyleAI as a fully serverless application on AWS using Lambda, S3, CloudFront, and Route53.

## 🏗️ Architecture Overview

### Backend (Serverless)
- **AWS Lambda**: Runs the Express.js API
- **API Gateway**: HTTP endpoints and routing
- **DynamoDB**: User data and wardrobe storage
- **S3**: Image storage for wardrobe items
- **Route53**: Custom domain for API

### Frontend (Static)
- **S3**: Static website hosting
- **CloudFront**: Global CDN distribution
- **Route53**: Custom domain routing
- **ACM**: SSL certificate management

## 📋 Prerequisites

### 1. AWS Account Setup
- AWS account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- Node.js 18+ installed

### 2. Domain Setup (Optional)
- Domain registered (can be with any registrar)
- Route53 hosted zone created for your domain
- SSL certificate created in ACM (us-east-1 region)

### 3. Required Permissions
Your AWS user needs these permissions:
- Lambda (full access)
- API Gateway (full access)
- DynamoDB (full access)
- S3 (full access)
- CloudFront (full access)
- Route53 (full access)
- CloudFormation (full access)
- ACM (read access)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd styleai
chmod +x scripts/*.sh
```

### 2. Deploy Everything with One Command

#### With Custom Domain
```bash
./scripts/deploy-all.sh \
  --domain yourdomain.com \
  --hosted-zone Z1234567890ABC \
  --certificate arn:aws:acm:us-east-1:123456789:certificate/abc-123
```

#### Without Custom Domain
```bash
./scripts/deploy-all.sh
```

### 3. Additional Options
```bash
./scripts/deploy-all.sh \
  --stack-name my-styleai-stack \
  --env staging \
  --region us-west-2 \
  --jwt-secret your-custom-jwt-secret
```

## 🔧 Step-by-Step Deployment

If you prefer to deploy each component separately, follow these steps:

### Step 1: Deploy Infrastructure
```bash
./scripts/deploy-infrastructure.sh \
  --domain yourdomain.com \
  --hosted-zone Z1234567890ABC \
  --certificate arn:aws:acm:us-east-1:123456789:certificate/abc-123
```

This creates:
- S3 buckets for frontend and images
- DynamoDB tables for users and wardrobe
- CloudFront distribution
- Route53 DNS records (if domain provided)

### Step 2: Deploy Backend
```bash
./scripts/deploy-backend.sh --stage prod
```

This deploys:
- Lambda function with Express.js API
- API Gateway endpoints
- IAM roles and permissions

### Step 3: Deploy Frontend
```bash
./scripts/deploy-frontend.sh
```

This:
- Builds the React application
- Uploads to S3
- Invalidates CloudFront cache

## 📊 Monitoring and Logs

### View Lambda Logs
```bash
cd backend
serverless logs -f app --stage prod --tail
```

### Monitor CloudFront
```bash
aws cloudfront get-distribution-config --id <distribution-id>
```

### Check DynamoDB Tables
```bash
aws dynamodb scan --table-name StyleAI_Users_prod --limit 5
aws dynamodb scan --table-name StyleAI_Wardrobe_prod --limit 5
```

## 🔄 Updating Your Deployment

### Update Infrastructure
```bash
./scripts/deploy-infrastructure.sh --stack-name styleai-stack
```

### Update Backend
```bash
./scripts/deploy-backend.sh --stage prod
```

### Update Frontend
```bash
./scripts/deploy-frontend.sh
```

## 🗑️ Removing Your Deployment

To remove all resources:
```bash
./scripts/remove-all.sh
```

## 🛠️ Customizing the Deployment

### Environment Variables
Edit the following files before deployment:
- `backend/.env`: Backend configuration
- `frontend/.env.production`: Frontend configuration

### CloudFormation Template
The main infrastructure template is at `cloudformation/styleai-infrastructure.yml`. You can modify it to:
- Add additional resources
- Change resource configurations
- Customize IAM permissions

### Serverless Configuration
The backend deployment uses Serverless Framework. Customize `backend/serverless.yml` to:
- Change Lambda configuration
- Add additional functions
- Modify API Gateway settings

## 💰 Cost Optimization

### Lambda
- Memory: 512MB (adjust based on usage)
- Timeout: 30s (sufficient for API calls)
- Provisioned concurrency: Only if needed

### DynamoDB
- On-demand billing (pay per request)
- Consider provisioned if high traffic

### S3
- Standard storage class
- Lifecycle policies for old images
- CloudFront caching reduces S3 requests

### CloudFront
- Price Class 100 (US, Canada, Europe)
- Upgrade if global audience

## 🔒 Security Best Practices

### API Security
- JWT tokens with short expiration
- CORS properly configured
- Rate limiting (API Gateway)
- Input validation

### Infrastructure Security
- IAM roles with minimal permissions
- S3 bucket policies
- CloudFront security headers
- WAF (if needed)

## 🚨 Troubleshooting

### Common Issues

1. **Domain not resolving**
   - Check Route53 nameservers
   - DNS propagation takes time (up to 48 hours)

2. **SSL certificate issues**
   - Certificate must be in us-east-1 for CloudFront
   - Ensure DNS validation is complete

3. **API Gateway CORS errors**
   - Check CORS configuration in serverless.yml
   - Verify frontend URL in environment variables

4. **Lambda timeout errors**
   - Increase timeout in serverless.yml
   - Optimize database queries
   - Check external API response times

5. **DynamoDB access errors**
   - Verify IAM permissions
   - Check table names match environment

### Debug Commands
```bash
# Test API endpoint
curl https://api.yourdomain.com/health

# Check Lambda function
aws lambda invoke --function-name styleai-backend-prod-app response.json

# Validate CloudFormation template
aws cloudformation validate-template --template-body file://cloudformation/styleai-infrastructure.yml
```

## 📈 Scaling Considerations

### Auto Scaling
- Lambda scales automatically
- DynamoDB on-demand scales automatically
- CloudFront handles global traffic

### Performance Optimization
- Enable Lambda provisioned concurrency for consistent performance
- Use DynamoDB DAX for caching
- Implement API response caching
- Optimize bundle sizes

## 🔄 CI/CD Pipeline

For automated deployments, consider setting up:

1. **GitHub Actions** or **AWS CodePipeline**
2. **Automated testing** before deployment
3. **Blue-green deployments** for zero downtime
4. **Environment-specific configurations**

Example GitHub Actions workflow:
```yaml
name: Deploy StyleAI
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: ./scripts/deploy-all.sh
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Verify all environment variables are set
4. Ensure AWS permissions are correct
