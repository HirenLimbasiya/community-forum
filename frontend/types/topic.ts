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
  created_by_data: UserResponse;
}

// types/topicReply.ts
export interface UserResponse {
  id: string;
  name: string; // Changed to lowercase
  email: string; // Changed to lowercase
}

export interface CreateTopicReply {
  content: string;
}

// export interface TopicReply {
//   id: string; // Changed to lowercase and ObjectID to string
//   topic_id: string; // Changed to lowercase
//   sender_id: string; // Changed to lowercase and ObjectID to string
//   sent_time: string; // Changed to lowercase
//   content: string; // Changed to lowercase
//   sender: UserResponse; // Changed to lowercase
//   top_reactions: string[]; // Changed to lowercase
//   reaction_count: number; // Changed to lowercase
//   user_reacted: Reaction; // Changed to lowercase
//   is_reacted: boolean; // Changed to lowercase
// }

export interface TopicReply {
  id: string;
  topic_id: string;
  sender_id: string;
  sent_time: Date;
  content: string;
  sender: UserResponse;
  delete: boolean;
  reactions: Reaction[];
  is_edited: boolean;
}

export interface ReactionGroup {
  count: number;
  id: string;
  user_reacted: Reaction;
}

export interface Reaction {
  id: string; 
  source_id: string; 
  reaction: string; 
  type: string; 
  user_id: string; 
  reacted_at: Date; 
}
