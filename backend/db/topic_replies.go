package db

import (
	"context"

	"community-forum-backend/types"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TopicReplyStore interface {
	Create(ctx context.Context, reply types.CreateTopicReply) (*types.TopicReply, error)
	UpdateByID(ctx context.Context, id string, content string) (types.TopicReply, error)
	GetByTopicID(ctx context.Context, topicID string, userID primitive.ObjectID) ([]types.TopicReply, error)
	GetByID(ctx context.Context, id string, userID primitive.ObjectID) (types.TopicReply, error)
	DeleteByID(ctx context.Context, id string) (types.TopicReply, error)
}

type topicReplyStore struct {
	Collection *mongo.Collection
}

func NewTopicReplyStore(collection *mongo.Collection) TopicReplyStore {
	return &topicReplyStore{Collection: collection}
}

func (s *topicReplyStore) Create(ctx context.Context, reply types.CreateTopicReply) (*types.TopicReply, error) {
	reply.Delete = false
	result, err := s.Collection.InsertOne(ctx, reply)
	if err != nil {
		return nil, err
	}

	insertedID, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, mongo.ErrNilDocument
	}

	// Create a TopicReply object by copying fields from CreateTopicReply
	topicReply := &types.TopicReply{
		ID:       insertedID,
		TopicID:  reply.TopicID,
		SentTime: reply.SentTime,
		Content:  reply.Content,
		SenderID: reply.SenderID,
	}

	return topicReply, nil
}

func (s *topicReplyStore) GetByTopicID(
	ctx context.Context,
	topicID string,
	userID primitive.ObjectID,
) ([]types.TopicReply, error) {

	pipeline := bson.A{
		//filter replies by topic ID
		bson.D{{Key: "$match", Value: bson.M{"topic_id": topicID}}},
		// append sender details in to object as a sender
		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "users",
			"localField":   "sender_id",
			"foreignField": "_id",
			"as":           "sender",
		}}},
		bson.D{{Key: "$unwind", Value: bson.M{
			"path":                       "$sender",
			"preserveNullAndEmptyArrays": true,
		}}},
		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "reactions",
			"localField":   "_id",
			"foreignField": "source_id",
			"as":           "reactions",
		}}},
		// bson.D{{Key: "$lookup", Value: bson.M{
		// 	"from": "reactions",
		// 	"let":  bson.M{"reply_id": "$_id"},
		// 	"pipeline": bson.A{
		// 		//filter reactions with reply id and reply type
		// 		bson.D{
		// 			{Key: "$match", Value: bson.M{
		// 				"$expr": bson.M{
		// 					"$and": bson.A{
		// 						bson.M{"$eq": bson.A{"$source_id", "$$reply_id"}},
		// 						bson.M{"$eq": bson.A{"$type", "topic_reply"}},
		// 					},
		// 				},
		// 			}},
		// 		},
		// 		// check if current user reacted or not
		// 		bson.D{
		// 			{Key: "$addFields", Value: bson.M{
		// 				"user_reacted": bson.M{
		// 					"$cond": bson.M{
		// 						"if":   bson.M{"$eq": bson.A{"$user_id", userID}},
		// 						"then": "$$ROOT",
		// 						"else": nil,
		// 					},
		// 				},
		// 			}},
		// 		},
		// 		// gorup by reaction type and take a count
		// 		bson.D{
		// 			{Key: "$group", Value: bson.M{
		// 				"_id":          "$reaction",
		// 				"count":        bson.M{"$sum": 1},
		// 				"user_reacted": bson.M{"$max": "$user_reacted"}, // Retain the user_reacted field
		// 			}},
		// 		},
		// 	},

		// 	"as": "reactions",
		// }}},
		bson.D{{Key: "$sort", Value: bson.M{"sent_time": 1}}},
	}

	cursor, err := s.Collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// var replie []bson.M
	var replies []types.TopicReply
	if err := cursor.All(ctx, &replies); err != nil {
		return nil, err
	}

	for replieIndex, replie := range replies {
		if replie.Delete {
			replie.Content = ""
			replies[replieIndex] = replie
		}
	}
	return replies, nil
}
func (s *topicReplyStore) GetByID(ctx context.Context, id string, userID primitive.ObjectID) (types.TopicReply, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return types.TopicReply{}, err
	}

	pipeline := bson.A{
		// Match the specific reply by ID
		bson.D{{Key: "$match", Value: bson.M{"_id": objectID}}},
		// Lookup sender details
		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "users",
			"localField":   "sender_id",
			"foreignField": "_id",
			"as":           "sender",
		}}},
		bson.D{{Key: "$unwind", Value: bson.M{
			"path":                       "$sender",
			"preserveNullAndEmptyArrays": true,
		}}},
		// Lookup reactions and count them
		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "reactions",
			"localField":   "_id",
			"foreignField": "source_id",
			"as":           "reactions",
		}}},
		// bson.D{{Key: "$lookup", Value: bson.M{
		// 	"from":         "reactions",
		// 	"let":          bson.M{"reply_id": "$_id"},
		// 	"pipeline": bson.A{
		// 		// Match reactions for this reply
		// 		bson.D{{Key: "$match", Value: bson.M{
		// 			"$expr": bson.M{
		// 				"$and": bson.A{
		// 					bson.M{"$eq": bson.A{"$source_id", "$$reply_id"}},
		// 					bson.M{"$eq": bson.A{"$type", "topic_reply"}},
		// 				},
		// 			},
		// 		}}},
		// 		// Check if the current user reacted
		// 		bson.D{{Key: "$addFields", Value: bson.M{
		// 			"user_reacted": bson.M{
		// 				"$cond": bson.M{
		// 					"if":   bson.M{"$eq": bson.A{"$user_id", userID}},
		// 					"then": "$$ROOT",
		// 					"else": nil,
		// 				},
		// 			},
		// 		}}},
		// 		// Group by reaction type and count
		// 		bson.D{{Key: "$group", Value: bson.M{
		// 			"_id":          "$reaction",
		// 			"count":        bson.M{"$sum": 1},
		// 			"user_reacted": bson.M{"$max": "$user_reacted"},
		// 		}}},
		// 	},
		// 	"as": "reactions",
		// }}},
		// Format reactions into ReactionGroup
		
	}

	cursor, err := s.Collection.Aggregate(ctx, pipeline)
	if err != nil {
		return types.TopicReply{}, err
	}
	defer cursor.Close(ctx)

	var replies []types.TopicReply
	if err = cursor.All(ctx, &replies); err != nil {
		return types.TopicReply{}, err
	}

	if len(replies) == 0 {
		return types.TopicReply{}, mongo.ErrNoDocuments
	}

	// Return the first reply in case of multiple matches (should be just one)
	return replies[0], nil
}





func (s *topicReplyStore) DeleteByID(ctx context.Context, id string) (types.TopicReply, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return types.TopicReply{}, err
	}

	filter := bson.M{"_id": objectID}

	// Define update fields
	updateFields := bson.M{
		"$set": bson.M{
			"delete": true,
		},
	}

	// Update the document in the collection
	_, err = s.Collection.UpdateOne(ctx, filter, updateFields)
	if err != nil {
		return types.TopicReply{}, err
	}

	var reply types.TopicReply
	err = s.Collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&reply)
	if err != nil {
		return types.TopicReply{}, err
	}
	reply.Content = ""
	return reply, nil
}

func (s *topicReplyStore) UpdateByID(ctx context.Context, id string, content string) (types.TopicReply, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return types.TopicReply{}, err
	}

	filter := bson.M{"_id": objectID}

	// Define update fields
	updateFields := bson.M{
		"$set": bson.M{
			"content":   content,
			"is_edited": true,
		},
	}

	// Update the document in the collection
	_, err = s.Collection.UpdateOne(ctx, filter, updateFields)
	if err != nil {
		return types.TopicReply{}, err
	}

	var reply types.TopicReply
	err = s.Collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&reply)
	if err != nil {
		return types.TopicReply{}, err
	}

	return reply, nil
}
