import { PutCommand, GetCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB, TABLES } from '../config/aws.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (userData) => {
  try {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const now = new Date().toISOString();

    const user = {
      id: userId,
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    console.log('Creating user with ID:', userId);
    
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLES.USERS,
        Item: user,
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );

    console.log('User created successfully');
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('User already exists');
    }
    
    throw new Error('Failed to create user: ' + error.message);
  }
};

export const getUserByEmail = async (email) => {
  try {
    console.log('Looking up user by email:', email);
    
    const response = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLES.USERS,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      })
    );

    const user = response.Items && response.Items.length > 0 ? response.Items[0] : null;
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error('Failed to lookup user: ' + error.message);
  }
};

export const getUserById = async (id) => {
  try {
    console.log('Looking up user by ID:', id);
    
    const response = await dynamoDB.send(
      new GetCommand({
        TableName: TABLES.USERS,
        Key: { id },
      })
    );

    if (response.Item) {
      const { password, ...userWithoutPassword } = response.Item;
      return userWithoutPassword;
    }

    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error('Failed to get user: ' + error.message);
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const now = new Date().toISOString();
    
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach((key) => {
      if (key !== 'id' && key !== 'email' && key !== 'createdAt') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = now;

    const response = await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { id: userId },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    const { password, ...userWithoutPassword } = response.Attributes;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user: ' + error.message);
  }
};

export const validatePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error validating password:', error);
    throw new Error('Password validation failed');
  }
};

export const generateToken = (userId) => {
  try {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
};
