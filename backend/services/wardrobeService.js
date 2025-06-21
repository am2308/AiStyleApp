import { PutCommand, GetCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB, TABLES } from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';

export const addWardrobeItem = async (itemData) => {
  const itemId = uuidv4();
  const now = new Date().toISOString();

  const item = {
    id: itemId,
    ...itemData,
    createdAt: now,
    updatedAt: now,
  };

  await dynamoDB.send(
    new PutCommand({
      TableName: TABLES.WARDROBE,
      Item: item,
    })
  );

  return item;
};

export const getUserWardrobeItems = async (userId) => {
  const response = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLES.WARDROBE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
  );

  return response.Items || [];
};

export const deleteWardrobeItem = async (itemId, userId) => {
  await dynamoDB.send(
    new DeleteCommand({
      TableName: TABLES.WARDROBE,
      Key: { id: itemId },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
  );
};

export const getWardrobeItem = async (itemId) => {
  const response = await dynamoDB.send(
    new GetCommand({
      TableName: TABLES.WARDROBE,
      Key: { id: itemId },
    })
  );

  return response.Item || null;
};
