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

export interface CreateTopicReply {
  content: string;
}

export interface TopicReply {
  id: string; // Changed to lowercase and ObjectID to string
  topic_id: string; // Changed to lowercase
  sender_id: string; // Changed to lowercase and ObjectID to string
  sent_time: string; // Changed to lowercase
  content: string; // Changed to lowercase
  sender: UserResponse; // Changed to lowercase
  top_reactions: string[]; // Changed to lowercase
  reaction_count: number; // Changed to lowercase
  user_reacted: Reaction; // Changed to lowercase
  is_reacted: boolean; // Changed to lowercase
}

export interface Reaction {
  id: string; // Changed to lowercase and ObjectID to string
  sourceId: string; // Changed to lowercase and ObjectID to string
  reaction: string; // Changed to lowercase
  type: string; // Changed to lowercase
  userId: string; // Changed to lowercase and ObjectID to string
  reactedAt: Date; // Changed to lowercase
}
