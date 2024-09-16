export interface CreateTopic {
  title: string;
  body: string;
}

export interface Topic {
  id: string;
  title: string;
  body: string;
  is_closed: boolean;
  created_by: string;
}

// types/topicReply.ts
export interface UserResponse {
  id: string; // Changed to lowercase and ObjectID to string
  name: string; // Changed to lowercase
  email: string; // Changed to lowercase
}

export interface TopicReply {
  id: string; // Changed to lowercase and ObjectID to string
  topicId: string; // Changed to lowercase
  senderId: string; // Changed to lowercase and ObjectID to string
  sentTime: Date; // Changed to lowercase
  content: string; // Changed to lowercase
  sender: UserResponse; // Changed to lowercase
  topReactions: string[]; // Changed to lowercase
  reactionCount: number; // Changed to lowercase
  userReacted: Reaction; // Changed to lowercase
  isReacted: boolean; // Changed to lowercase
}

export interface Reaction {
  id: string; // Changed to lowercase and ObjectID to string
  sourceId: string; // Changed to lowercase and ObjectID to string
  reaction: string; // Changed to lowercase
  type: string; // Changed to lowercase
  userId: string; // Changed to lowercase and ObjectID to string
  reactedAt: Date; // Changed to lowercase
}
