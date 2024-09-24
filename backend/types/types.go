package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID `json:"id,omitempty"    bson:"_id,omitempty"`
	Name           string             `json:"name"            bson:"name"`
	Email          string             `json:"email"           bson:"email"`
	Password       string             `json:"password"        bson:"password"`
	Username       string             `json:"username"        bson:"username"`
	ProfilePicture string             `json:"profile_picture" bson:"profile_picture"`
	SocialMedia    SocialMedia        `json:"social_media"    bson:"social_media"`
	Bio            string             `json:"bio"             bson:"bio"`
}
type UserResponse struct {
	ID             primitive.ObjectID `json:"id,omitempty"    bson:"_id,omitempty"`
	Name           string             `json:"name"            bson:"name"`
	Email          string             `json:"email"           bson:"email"`
	Username       string             `json:"username"        bson:"username"`
	ProfilePicture string             `json:"profile_picture" bson:"profile_picture"`
	SocialMedia    SocialMedia        `json:"social_media"    bson:"social_media"`
	Bio            string             `json:"bio"             bson:"bio"`
}

type Topic struct {
	ID            primitive.ObjectID `json:"id,omitempty"    bson:"_id,omitempty"`
	Title         string             `json:"title"           bson:"title"`
	Body          string             `json:"body"            bson:"body"`
	IsClosed      bool               `json:"is_closed"       bson:"is_closed"`
	CreatedBy     primitive.ObjectID `json:"created_by"      bson:"created_by"`
	CreatedByData UserResponse       `json:"created_by_data" bson:"created_by_data"`
}

type CreateTopic struct {
	Title     string             `json:"title"      bson:"title"`
	Body      string             `json:"body"       bson:"body"`
	CreatedBy primitive.ObjectID `json:"created_by" bson:"created_by"`
}

type CreateUser struct {
	Name           string      `json:"name"            bson:"name"`
	Email          string      `json:"email"           bson:"email"`
	Password       string      `json:"password"        bson:"password"`
	Username       string      `json:"username"        bson:"username"`
	ProfilePicture string      `json:"profile_picture" bson:"profile_picture"`
	SocialMedia    SocialMedia `json:"social_media"    bson:"social_media"`
	Bio            string      `json:"bio"             bson:"bio"`
}
type UserProfile struct {
	Name           string      `json:"name"            bson:"name"`
	Email          string      `json:"email"           bson:"email"`
	Username       string      `json:"username"        bson:"username"`
	ProfilePicture string      `json:"profile_picture" bson:"profile_picture"`
	SocialMedia    SocialMedia `json:"social_media"    bson:"social_media"`
	Bio            string      `json:"bio"             bson:"bio"`
}
type UpdateUser struct {
	Name           string      `json:"name"            bson:"name"`
	Email          string      `json:"email"           bson:"email"`
	Username       string      `json:"username"        bson:"username"`
	ProfilePicture string      `json:"profile_picture" bson:"profile_picture"`
	SocialMedia    SocialMedia `json:"social_media"    bson:"social_media"`
	Bio            string      `json:"bio"             bson:"bio"`
}

type SocialMedia struct {
	Twitter   string `json:"twitter"   bson:"twitter"`
	LinkedIn  string `json:"linkedin"  bson:"linkedin"`
	GitHub    string `json:"github"    bson:"github"`
	Facebook  string `json:"facebook"  bson:"facebook"`
	Instagram string `json:"instagram" bson:"instagram"`
	Snapchat  string `json:"snapchat"  bson:"snapchat"`
	YouTube   string `json:"youtube"   bson:"youtube"`
	Pinterest string `json:"pinterest" bson:"pinterest"`
	Discord   string `json:"discord"   bson:"discord"`
	Website   string `json:"website"   bson:"website"`
}

type TopicReply struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	TopicID   string             `json:"topic_id"     bson:"topic_id"`
	SenderID  primitive.ObjectID `json:"sender_id"    bson:"sender_id"`
	SentTime  time.Time          `json:"sent_time"    bson:"sent_time"`
	Content   string             `json:"content"      bson:"content"`
	Sender    UserResponse       `json:"sender"       bson:"sender"`
	Delete    bool               `json:"delete"       bson:"delete"`
	Reactions []Reaction         `json:"reactions"    bson:"reactions"`
	IsEdited  bool               `json:"is_edited"    bson:"is_edited"`
	// ReactionsData map[string]interface{} `json:"reactions_data" bson:"reactions_data"`
}

type ReactionGroup struct {
	Count       int      `json:"count"        bson:"count"`
	Id          string   `json:"id"           bson:"_id"`
	UserReacted Reaction `json:"user_reacted" bson:"user_reacted"`
}

type CreateTopicReply struct {
	TopicID  string             `json:"topic_id"  bson:"topic_id"`
	SenderID primitive.ObjectID `json:"sender_id" bson:"sender_id"`
	SentTime time.Time          `json:"sent_time" bson:"sent_time"`
	Content  string             `json:"content"   bson:"content"`
	Delete   bool               `json:"delete"    bson:"delete"`
}
type CreateTopicReplyFromParams struct {
	Content string `json:"content" bson:"content"`
}
type CreateTopicReplyReactionFromParams struct {
	Content string `json:"content"  bson:"content"`
	TopicID string `json:"topic_id" bson:"topic_id"`
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
