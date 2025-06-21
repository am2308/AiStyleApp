import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

// Validate environment variables - FIXED for Lambda environment
const validateAWSConfig = () => {
  // In Lambda, AWS credentials are provided automatically via IAM roles
  // We don't need to check for explicit credentials
  const required = ['AWS_REGION'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required AWS environment variables: ${missing.join(', ')}`);
  }
  
  console.log('AWS Configuration:');
  console.log('- Region:', process.env.AWS_REGION);
  console.log('- Running in Lambda environment with IAM role credentials');
};

// Validate configuration on startup
try {
  validateAWSConfig();
} catch (error) {
  console.error('AWS Configuration Error:', error.message);
  console.error('Please check your environment variables.');
  // Don't exit in Lambda environment
}

// AWS Configuration - Use default credential chain in Lambda
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1',
  // Don't specify credentials - let AWS SDK use IAM role
};

// DynamoDB Configuration
const dynamoClient = new DynamoDBClient(awsConfig);
export const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

// S3 Configuration
export const s3Client = new S3Client({
  ...awsConfig,
  region: process.env.S3_REGION || process.env.AWS_REGION || 'ap-south-1',
});

export const TABLES = {
  USERS: process.env.USERS_TABLE || 'StyleAI_Users',
  WARDROBE: process.env.WARDROBE_TABLE || 'StyleAI_Wardrobe',
};

export const S3_BUCKET = process.env.S3_BUCKET;

// Test AWS connection
export const testAWSConnection = async () => {
  try {
    console.log('Testing AWS connection...');
    
    // Test DynamoDB connection
    const { ListTablesCommand } = await import('@aws-sdk/client-dynamodb');
    await dynamoClient.send(new ListTablesCommand({}));
    console.log('✅ DynamoDB connection successful');
    
    // Test S3 connection
    const { ListBucketsCommand } = await import('@aws-sdk/client-s3');
    await s3Client.send(new ListBucketsCommand({}));
    console.log('✅ S3 connection successful');
    
    return true;
  } catch (error) {
    console.error('❌ AWS connection failed:', error.message);
    return false;
  }
};

export { dynamoClient };
