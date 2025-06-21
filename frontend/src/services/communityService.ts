import { api } from './api';

export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    profilePic?: string;
    isFollowing: boolean;
  };
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  location?: string;
  createdAt: string;
  challenge?: {
    id: string;
    name: string;
  };
  wardrobeItems?: {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
  }[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  participants: number;
  entries: number;
  isActive: boolean;
  isJoined: boolean;
  daysLeft: number;
  prizes?: {
    name: string;
    description: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  profilePic?: string;
  followers: number;
  posts: number;
  isFollowing: boolean;
}

// Mock data for development
const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Sarah Chen',
      profilePic: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150',
      isFollowing: true
    },
    images: [
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    caption: 'Loving this monochrome look for fall! #MonochromeWeek #FallFashion',
    likes: 342,
    comments: 28,
    isLiked: false,
    isSaved: false,
    tags: ['MonochromeWeek', 'FallFashion', 'OOTD'],
    location: 'New York, NY',
    createdAt: '2023-10-15T14:30:00Z',
    challenge: {
      id: '201',
      name: 'Monochrome Week'
    },
    wardrobeItems: [
      {
        id: 'w1',
        name: 'Black Turtleneck',
        category: 'Tops',
        imageUrl: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: 'w2',
        name: 'Black Jeans',
        category: 'Bottoms',
        imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ]
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Michael Johnson',
      profilePic: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
      isFollowing: false
    },
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    caption: 'Business casual done right. Perfect for those important meetings! #BusinessCasual #ProfessionalStyle',
    likes: 287,
    comments: 15,
    isLiked: true,
    isSaved: true,
    tags: ['BusinessCasual', 'ProfessionalStyle', 'MensStyle'],
    createdAt: '2023-10-14T09:15:00Z',
    wardrobeItems: [
      {
        id: 'w3',
        name: 'Navy Blazer',
        category: 'Outerwear',
        imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ]
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Emma Rodriguez',
      profilePic: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=150',
      isFollowing: true
    },
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    caption: 'Summer vibes all year round! 🌞 #SummerStyle #BeachDay',
    likes: 315,
    comments: 22,
    isLiked: false,
    isSaved: false,
    tags: ['SummerStyle', 'BeachDay', 'Vacation'],
    location: 'Miami Beach, FL',
    createdAt: '2023-10-13T16:45:00Z',
    challenge: {
      id: '202',
      name: 'Summer Vibes'
    }
  }
];

const mockChallenges: Challenge[] = [
  {
    id: '201',
    name: 'Monochrome Week',
    description: 'Create stunning outfits using a single color palette. Show your creativity with monochromatic styling!',
    imageUrl: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2023-10-10T00:00:00Z',
    endDate: '2023-10-17T23:59:59Z',
    participants: 248,
    entries: 156,
    isActive: true,
    isJoined: true,
    daysLeft: 2,
    prizes: [
      {
        name: 'Featured on Homepage',
        description: 'Top entry will be featured on the StyleAI homepage'
      },
      {
        name: 'Premium Subscription',
        description: '3 months of StyleAI Premium'
      }
    ]
  },
  {
    id: '202',
    name: 'Summer Vibes',
    description: 'Share your best summer outfits and beach styles. Bright colors, light fabrics, and vacation vibes!',
    imageUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2023-10-05T00:00:00Z',
    endDate: '2023-10-19T23:59:59Z',
    participants: 312,
    entries: 187,
    isActive: true,
    isJoined: false,
    daysLeft: 4
  },
  {
    id: '203',
    name: 'Business Casual',
    description: 'Show us your best professional yet comfortable outfits. Perfect for the modern workplace!',
    imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-10-15T23:59:59Z',
    participants: 189,
    entries: 112,
    isActive: true,
    isJoined: false,
    daysLeft: 0
  },
  {
    id: '204',
    name: 'Autumn Layers',
    description: 'Showcase your layering skills with cozy autumn outfits. Sweaters, scarves, and seasonal colors!',
    imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2023-10-20T00:00:00Z',
    endDate: '2023-11-03T23:59:59Z',
    participants: 87,
    entries: 0,
    isActive: false,
    isJoined: false,
    daysLeft: 10
  }
];

const mockUsers: User[] = [
  {
    id: '101',
    name: 'Sarah Chen',
    profilePic: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: 2453,
    posts: 87,
    isFollowing: true
  },
  {
    id: '102',
    name: 'Michael Johnson',
    profilePic: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: 1876,
    posts: 64,
    isFollowing: false
  },
  {
    id: '103',
    name: 'Emma Rodriguez',
    profilePic: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: 1542,
    posts: 43,
    isFollowing: true
  },
  {
    id: '104',
    name: 'David Kim',
    profilePic: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: 1298,
    posts: 38,
    isFollowing: false
  },
  {
    id: '105',
    name: 'Olivia Martinez',
    profilePic: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: 1187,
    posts: 52,
    isFollowing: false
  },
  {
    id: '106',
    name: 'James Wilson',
    profilePic: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: 965,
    posts: 29,
    isFollowing: true
  },
  {
    id: '107',
    name: 'Sophia Lee',
    profilePic: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: 843,
    posts: 31,
    isFollowing: false
  }
];

export const communityService = {
  async getPosts(): Promise<Post[]> {
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/community/posts');
      // return response.data;
      
      // For now, return mock data
      return mockPosts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },
  
  async getChallenges(): Promise<Challenge[]> {
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/community/challenges');
      // return response.data;
      
      // For now, return mock data
      return mockChallenges;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  },
  
  async getTrendingUsers(): Promise<User[]> {
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/community/users/trending');
      // return response.data;
      
      // For now, return mock data
      return mockUsers;
    } catch (error) {
      console.error('Error fetching trending users:', error);
      return [];
    }
  },
  
  async createPost(postData: any): Promise<Post> {
    try {
      // In a real app, this would be an API call with FormData
      // const formData = new FormData();
      // formData.append('caption', postData.caption);
      // postData.images.forEach((image: File) => {
      //   formData.append('images', image);
      // });
      // postData.tags.forEach((tag: string) => {
      //   formData.append('tags', tag);
      // });
      // if (postData.location) formData.append('location', postData.location);
      // if (postData.challengeId) formData.append('challengeId', postData.challengeId);
      // if (postData.wardrobeItems) {
      //   formData.append('wardrobeItems', JSON.stringify(postData.wardrobeItems));
      // }
      
      // const response = await api.post('/community/posts', formData);
      // return response.data;
      
      // For now, create a mock post
      const newPost: Post = {
        id: `post_${Date.now()}`,
        user: {
          id: '999', // Current user
          name: 'You',
          isFollowing: false
        },
        images: postData.images.map((_: any, index: number) => 
          `https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600&random=${index}`
        ),
        caption: postData.caption,
        likes: 0,
        comments: 0,
        isLiked: false,
        isSaved: false,
        tags: postData.tags,
        location: postData.location,
        createdAt: new Date().toISOString(),
        wardrobeItems: postData.wardrobeItems?.length > 0 
          ? postData.wardrobeItems.map((itemId: string) => {
              const item = wardrobeItems.find((i: any) => i.id === itemId);
              return item ? {
                id: item.id,
                name: item.name,
                category: item.category,
                imageUrl: item.imageUrl
              } : null;
            }).filter(Boolean)
          : undefined,
        challenge: postData.challengeId 
          ? challenges.find(c => c.id === postData.challengeId)
          : undefined
      };
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  async likePost(postId: string): Promise<void> {
    try {
      // In a real app, this would be an API call
      // await api.post(`/community/posts/${postId}/like`);
      
      // For now, do nothing (state is updated in the component)
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },
  
  async joinChallenge(challengeId: string): Promise<void> {
    try {
      // In a real app, this would be an API call
      // await api.post(`/community/challenges/${challengeId}/join`);
      
      // For now, do nothing (state is updated in the component)
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }
};
