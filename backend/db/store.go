package db

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type Store struct {
	User         UserStore
	Topic        TopicStore
	TopicReplies TopicReplyStore
	Reactions    ReactionStore
	FileUpload   FileUploadStore
}

func NewStore(database *mongo.Database) *Store {
	userCollection := database.Collection("users")
	topicCollection := database.Collection("topics")
	topicRepliesCollection := database.Collection("topic_replies")
	reactionCollection := database.Collection("reactions")
	filesCollection := database.Collection("uploads")
	return &Store{
		User:         NewUserStore(userCollection),
		Topic:        NewTopicStore(topicCollection),
		TopicReplies: NewTopicReplyStore(topicRepliesCollection),
		Reactions:    NewReactionStore(reactionCollection),
		FileUpload:   NewFileUploadStore(filesCollection),
	}
}
