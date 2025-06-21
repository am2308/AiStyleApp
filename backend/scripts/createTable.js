import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { dynamoClient, testAWSConnection } from '../config/aws.js';
import dotenv from 'dotenv';

dotenv.config();

const createUsersTable = async () => {
  const params = {
    TableName: 'StyleAI_Users',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' },
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    console.log('Creating StyleAI_Users table...');
    await dynamoClient.send(new CreateTableCommand(params));
    console.log('✅ StyleAI_Users table created successfully');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  StyleAI_Users table already exists');
    } else {
      console.error('❌ Error creating StyleAI_Users table:', error.message);
      throw error;
    }
  }
};

const createWardrobeTable = async () => {
  const params = {
    TableName: 'StyleAI_Wardrobe',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'UserIdIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    console.log('Creating StyleAI_Wardrobe table...');
    await dynamoClient.send(new CreateTableCommand(params));
    console.log('✅ StyleAI_Wardrobe table created successfully');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  StyleAI_Wardrobe table already exists');
    } else {
      console.error('❌ Error creating StyleAI_Wardrobe table:', error.message);
      throw error;
    }
  }
};

const createTables = async () => {
  try {
    console.log('🚀 Setting up DynamoDB tables...');
    
    // Test AWS connection first
    const connected = await testAWSConnection();
    if (!connected) {
      console.error('❌ Cannot connect to AWS. Please check your credentials.');
      process.exit(1);
    }
    
    await createUsersTable();
    await createWardrobeTable();
    
    console.log('🎉 Database setup complete!');
    console.log('\nNext steps:');
    console.log('1. Make sure your S3 bucket exists and is properly configured');
    console.log('2. Start your backend server: npm run dev');
    console.log('3. Start your frontend server: cd ../frontend && npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your AWS credentials in .env file');
    console.error('2. Ensure your AWS user has DynamoDB permissions');
    console.error('3. Verify your AWS region is correct');
    process.exit(1);
  }
};

createTables();
