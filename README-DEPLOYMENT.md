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
- AWS CLI installed and configured
- Node.js 18+ installed

### 2. Domain Setup
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
./scripts/setup.sh
```

### 2. Configure Environment
Edit `.env` file with your settings:
```bash
# Required API Keys (get free accounts)
HUGGINGFACE_API_KEY=your-key-here
EBAY_APP_ID=your-ebay-app-id
RAPIDAPI_KEY=your-rapidapi-key

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Domain Configuration
API_DOMAIN_NAME=api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### 3. Set Deployment Variables
```bash
export DOMAIN_NAME=yourdomain.com
export HOSTED_ZONE_ID=Z1234567890ABC  # From Route53
export CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789:certificate/abc-123  # From ACM
```

### 4. Deploy Everything
```bash
./scripts/deploy.sh prod
```

## 🔧 Detailed Setup Steps

### Step 1: Domain and SSL Setup

1. **Register Domain** (if you don't have one)
   - Use any domain registrar (GoDaddy, Namecheap, etc.)

2. **Create Route53 Hosted Zone**
   ```bash
   aws route53 create-hosted-zone \
     --name yourdomain.com \
     --caller-reference $(date +%s)
   ```

3. **Update Domain Nameservers**
   - Get nameservers from Route53 hosted zone
   - Update your domain registrar to use Route53 nameservers

4. **Create SSL Certificate**
   ```bash
   aws acm request-certificate \
     --domain-name yourdomain.com \
     --subject-alternative-names "*.yourdomain.com" \
     --validation-method DNS \
     --region us-east-1
   ```

5. **Validate Certificate**
   - Add DNS validation records to Route53
   - Wait for certificate to be issued

### Step 2: Backend Deployment

The backend is deployed using Serverless Framework:

```bash
# Deploy to development
npx serverless deploy --stage dev

# Deploy to production
npx serverless deploy --stage prod

# View logs
npx serverless logs -f app --stage prod

# Remove deployment
npx serverless remove --stage prod
```

### Step 3: Frontend Deployment

Frontend is deployed using CloudFormation and S3:

```bash
# Deploy infrastructure
aws cloudformation deploy \
  --template-file cloudformation/frontend-infrastructure.yml \
  --stack-name styleai-frontend-prod \
  --parameter-overrides \
    DomainName=yourdomain.com \
    HostedZoneId=Z1234567890ABC \
    CertificateArn=arn:aws:acm:us-east-1:123456789:certificate/abc-123

# Upload files
aws s3 sync frontend/dist s3://yourdomain.com-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## 🛠️ Local Development

For local development with serverless offline:

```bash
./scripts/local-dev.sh
```

This starts:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## 📊 Monitoring and Logs

### View Lambda Logs
```bash
# Real-time logs
npx serverless logs -f app --stage prod --tail

# CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/styleai
```

### Monitor Performance
- CloudWatch dashboards
- X-Ray tracing (enable in serverless.yml)
- API Gateway metrics

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
aws cloudformation validate-template --template-body file://cloudformation/frontend-infrastructure.yml
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
      - run: ./scripts/deploy.sh prod
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

## 🎉 Success!

Once deployed, your StyleAI application will be available at:
- **Frontend**: https://yourdomain.com
- **API**: https://api.yourdomain.com

The application is now fully serverless, scalable, and ready for production use!
