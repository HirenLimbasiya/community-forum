package db

import (
	"context"

	"community-forum-backend/types"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TopicStore interface {
	Get(ctx context.Context) ([]types.Topic, error)
	Create(ctx context.Context, topic types.CreateTopic) (types.Topic, error)
	GetByID(ctx context.Context, id string) (types.Topic, error)
	UpdateByID(ctx context.Context, id string, topic types.CreateTopic) error
	DeleteByID(ctx context.Context, id string) error
	GetByUserID(ctx context.Context, userID primitive.ObjectID) ([]types.Topic, error)
	CloseByID(ctx context.Context, id string) error 
}

type topicStore struct {
	Collection *mongo.Collection
}

func NewTopicStore(collection *mongo.Collection) TopicStore {
	return &topicStore{Collection: collection}
}

func (s *topicStore) Get(ctx context.Context) ([]types.Topic, error) {
	// Define the aggregation pipeline
	pipeline := []bson.M{
		{
			"$lookup": bson.M{
				"from":         "users",           
				"localField":   "created_by",      
				"foreignField": "_id",             
				"as":           "created_by_data", 
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$created_by_data", 
				"preserveNullAndEmptyArrays": true,               
			},
		},
	}

	// Execute the aggregation pipeline
	cursor, err := s.Collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var topics []types.Topic
	for cursor.Next(ctx) {
		var topic types.Topic
		if err := cursor.Decode(&topic); err != nil {
			return nil, err
		}
		topics = append(topics, topic)
	}

	return topics, nil
}


func (s *topicStore) Create(ctx context.Context, topic types.CreateTopic) (types.Topic, error) {
	result, err := s.Collection.InsertOne(ctx, topic)
	if err != nil {
		return types.Topic{}, err
	}

	// Retrieve the inserted document from the database using its ID
	var insertedTopic types.Topic
	err = s.Collection.FindOne(ctx, bson.M{"_id": result.InsertedID}).Decode(&insertedTopic)
	if err != nil {
		return types.Topic{}, err
	}

	// Return the inserted document
	return insertedTopic, nil

}

func (s *topicStore) GetByID(ctx context.Context, id string) (types.Topic, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return types.Topic{}, err
	}

	var topic types.Topic
	err = s.Collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&topic)
	if err != nil {
		return types.Topic{}, err
	}

	return topic, nil
}

func (s *topicStore) DeleteByID(ctx context.Context, id string) error {
	// Define filter to match documents with the given ID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectID}

	// Delete the document from the collection
	result, err := s.Collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	// If no document was deleted, return ErrNotFound
	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}

func (s *topicStore) UpdateByID(ctx context.Context, id string, fields types.CreateTopic) error {
	// Define filter to match documents with the given ID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectID}

	// Define update fields
	updateFields := bson.M{"$set": fields}

	// Update the document in the collection
	_, err = s.Collection.UpdateOne(ctx, filter, updateFields)
	if err != nil {
		return err
	}

	return nil
}
func (s *topicStore) GetByUserID(ctx context.Context, userID primitive.ObjectID) ([]types.Topic, error) {
	// Filter topics where "created_by" matches the given userID
	filter := bson.M{"created_by": userID}

	// Find topics based on the filter
	cursor, err := s.Collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var topics []types.Topic
	for cursor.Next(ctx) {
		var topic types.Topic
		if err := cursor.Decode(&topic); err != nil {
			return nil, err
		}
		topics = append(topics, topic)
	}

	// Check for errors after looping through the cursor
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return topics, nil
}
func (s *topicStore) CloseByID(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectID}

	update := bson.M{"$set": bson.M{"is_closed": true}}

	_, err = s.Collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	return nil
}
