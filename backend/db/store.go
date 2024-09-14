package db

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type Store struct {
	User         UserStore
	Topic        TopicStore
	TopicReplies TopicReplyStore
	Reactions    ReactionStore
}

func NewStore(database *mongo.Database) *Store {
	userCollection := database.Collection("users")
	topicCollection := database.Collection("topics")
	topicRepliesCollection := database.Collection("topic_replies")
	reactionCollection := database.Collection("reactions")
	return &Store{
		User:         NewUserStore(userCollection),
		Topic:        NewTopicStore(topicCollection),
		TopicReplies: NewTopicReplyStore(topicRepliesCollection),
		Reactions:    NewReactionStore(reactionCollection),
	}
}
