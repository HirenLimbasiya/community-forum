package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name     string             `json:"name"         bson:"name"`
	Email    string             `json:"email"        bson:"email"`
	Password string             `json:"password"     bson:"password"`
}
type UserResponse struct {
	ID    primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name  string             `json:"name"         bson:"name"`
	Email string             `json:"email"        bson:"email"`
}

type Topic struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title     string             `json:"title"        bson:"title"`
	Body      string             `json:"body"         bson:"body"`
	IsClosed  bool               `json:"is_closed"    bson:"is_closed"`
	CreatedBy primitive.ObjectID `json:"created_by"   bson:"created_by"`
}

type CreateTopic struct {
	Title     string             `json:"title"      bson:"title"`
	Body      string             `json:"body"       bson:"body"`
	CreatedBy primitive.ObjectID `json:"created_by" bson:"created_by"`
}

type CreateUser struct {
	Name     string `json:"name"     bson:"name"`
	Email    string `json:"email"    bson:"email"`
	Password string `json:"password" bson:"password"`
}
type UpdateUser struct {
	Name  string `json:"name"  bson:"name"`
	Email string `json:"email" bson:"email"`
}

type TopicReply struct {
	ID            primitive.ObjectID `json:"id,omitempty"   bson:"_id,omitempty"`
	TopicID       string             `json:"topic_id"       bson:"topic_id"`
	SenderID      primitive.ObjectID `json:"sender_id"      bson:"sender_id"`
	SentTime      time.Time          `json:"sent_time"      bson:"sent_time"`
	Content       string             `json:"content"        bson:"content"`
	Sender        UserResponse       `json:"sender"         bson:"sender"`
	TopReactions  []string           `json:"top_reactions"  bson:"top_reactions"`
	ReactionCount int                `json:"reaction_count" bson:"reaction_count"`
	UserReacted   Reaction           `json:"user_reacted"   bson:"user_reacted"`
	IsReactesd    bool               `json:"is_reacted"     bson:"is_reacted"`
	Delete        bool               `json:"delete"         bson:"delete"`
	// ReactionsData map[string]interface{} `json:"reactions_data" bson:"reactions_data"`
}
type CreateTopicReply struct {
	TopicID  string             `json:"topic_id"  bson:"topic_id"`
	SenderID primitive.ObjectID `json:"sender_id" bson:"sender_id"`
	SentTime time.Time          `json:"sent_time" bson:"sent_time"`
	Content  string             `json:"content"   bson:"content"`
}
type CreateTopicReplyFromParams struct {
	Content string `json:"content" bson:"content"`
}

type Reaction struct {
	ID        primitive.ObjectID `json:"id"         bson:"_id,omitempty"`
	SourceID  primitive.ObjectID `json:"source_id"  bson:"source_id"`
	Reaction  string             `json:"reaction"   bson:"reaction"`
	Type      string             `json:"type"       bson:"type"`
	UserID    primitive.ObjectID `json:"user_id"    bson:"user_id"`
	ReactedAt time.Time          `json:"reacted_at" bson:"reacted_at"`
}

// Define a type for creating reactions
type CreateReaction struct {
	Reaction string `json:"reaction"  bson:"reaction"`
	Type     string `json:"type"      bson:"type"`
	SourceID string `json:"source_id" bson:"source_id"`
}

type UpdateReaction struct {
	Reaction  string             `json:"reaction"   bson:"reaction"`
	Type      string             `json:"type"       bson:"type"`
	SourceID  primitive.ObjectID `json:"source_id"  bson:"source_id"`
	ReactedAt time.Time          `json:"reacted_at" bson:"reacted_at"`
}

type WebSocketMessage struct {
	Type        string                 `json:"type"         bson:"type"`
	SessionId   string                 `json:"session_id"   bson:"session_id"`
	SenderID    string                 `json:"sender_id"    bson:"sender_id"`
	RecipientID string                 `json:"recipient_id" bson:"recipient_id"`
	Data        map[string]interface{} `json:"data"         bson:"data"`
}

type WebSocketSentMessage struct {
	Type string      `json:"type" bson:"type"`
	Data interface{} `json:"data" bson:"data"`
}
