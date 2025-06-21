import { PutCommand, GetCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB, TABLES } from '../config/aws.js';

export class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.name = userData.name;
    this.password = userData.password;
    this.skinTone = userData.skinTone;
    this.bodyType = userData.bodyType;
    this.preferredStyle = userData.preferredStyle;
    this.createdAt = userData.createdAt;
    this.updatedAt = userData.updatedAt;
    
    // Subscription fields
    this.subscriptionStatus = userData.subscriptionStatus || 'free';
    this.subscriptionPlan = userData.subscriptionPlan || null;
    this.subscriptionStartDate = userData.subscriptionStartDate || null;
    this.subscriptionEndDate = userData.subscriptionEndDate || null;
    this.recommendationsUsed = userData.recommendationsUsed || 0;
    this.freeRecommendationsLimit = userData.freeRecommendationsLimit || 3;
  }

  // Check if user can access recommendations
  canAccessRecommendations() {
    if (this.subscriptionStatus === 'active') {
      return { allowed: true, reason: 'active_subscription' };
    }
    
    if (this.recommendationsUsed < this.freeRecommendationsLimit) {
      return { 
        allowed: true, 
        reason: 'free_trial',
        remaining: this.freeRecommendationsLimit - this.recommendationsUsed
      };
    }
    
    return { 
      allowed: false, 
      reason: 'limit_exceeded',
      message: 'You have used all your free recommendations. Please subscribe to continue.'
    };
  }

  // Increment recommendation usage
  async incrementRecommendationUsage() {
    this.recommendationsUsed += 1;
    this.updatedAt = new Date().toISOString();
    
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { id: this.id },
        UpdateExpression: 'SET recommendationsUsed = :used, updatedAt = :updated',
        ExpressionAttributeValues: {
          ':used': this.recommendationsUsed,
          ':updated': this.updatedAt
        }
      })
    );
  }

  // Subscribe user to a plan
  async subscribe(plan) {
    const now = new Date();
    const endDate = new Date(now);
    
    // Calculate end date based on plan
    switch (plan) {
      case '1_month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '3_months':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case '6_months':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case '1_year':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        throw new Error('Invalid subscription plan');
    }
    
    this.subscriptionStatus = 'active';
    this.subscriptionPlan = plan;
    this.subscriptionStartDate = now.toISOString();
    this.subscriptionEndDate = endDate.toISOString();
    this.updatedAt = now.toISOString();
    
    await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { id: this.id },
        UpdateExpression: 'SET subscriptionStatus = :status, subscriptionPlan = :plan, subscriptionStartDate = :start, subscriptionEndDate = :end, updatedAt = :updated',
        ExpressionAttributeValues: {
          ':status': this.subscriptionStatus,
          ':plan': this.subscriptionPlan,
          ':start': this.subscriptionStartDate,
          ':end': this.subscriptionEndDate,
          ':updated': this.updatedAt
        }
      })
    );
  }

  // Check if subscription is expired
  isSubscriptionExpired() {
    if (this.subscriptionStatus !== 'active' || !this.subscriptionEndDate) {
      return true;
    }
    
    return new Date() > new Date(this.subscriptionEndDate);
  }

  // Get subscription info
  getSubscriptionInfo() {
    return {
      status: this.subscriptionStatus,
      plan: this.subscriptionPlan,
      startDate: this.subscriptionStartDate,
      endDate: this.subscriptionEndDate,
      isExpired: this.isSubscriptionExpired(),
      recommendationsUsed: this.recommendationsUsed,
      freeRecommendationsLimit: this.freeRecommendationsLimit
    };
  }

  // Convert to JSON (excluding password)
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
