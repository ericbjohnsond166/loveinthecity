export interface User {
  id: string;
  name: string;
  age: number;
  distance: number; // Keep for logic, though screenshots show City
  bio: string;
  images: string[];
  isVip?: boolean;
  tags: string[];
  
  // New fields based on screenshots
  height?: string;
  bust?: string;
  serviceCity?: string;
  airFreight?: boolean;
  chargeRange?: number; // 1-5 stars
  likes?: number;
  creditScore?: number;
  residence?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  unread: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  image: string;
  timestamp: string;
  likes: number;
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  isPromo?: boolean;
}