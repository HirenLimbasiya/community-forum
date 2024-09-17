package db

import (
	"context"

	"community-forum-backend/types"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ReactionStore interface {
	Get(ctx context.Context) ([]types.Reaction, error)
	Create(ctx context.Context, reaction types.Reaction) (types.Reaction, error)
	GetByID(ctx context.Context, id string) (types.Reaction, error)
	DeleteByID(ctx context.Context, id string) error
	UpdateByID(ctx context.Context, id string, reaction types.UpdateReaction) error
	CheckUserReactWithTypeAndSourceID(
		ctx context.Context,
		reactionType string,
		sourceID primitive.ObjectID,
		userID primitive.ObjectID,
	) (bool, error)
	GetByUserAndSource(
		ctx context.Context,
		reactionType string,
		sourceID primitive.ObjectID,
		userID primitive.ObjectID,
	) (*types.Reaction, error)
}

type reactionStore struct {
	Collection *mongo.Collection
}

func NewReactionStore(collection *mongo.Collection) ReactionStore {
	return &reactionStore{Collection: collection}
}

func (s *reactionStore) Get(ctx context.Context) ([]types.Reaction, error) {
	cursor, err := s.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var reactions []types.Reaction
	for cursor.Next(ctx) {
		var reaction types.Reaction
		if err := cursor.Decode(&reaction); err != nil {
			return nil, err
		}
		reactions = append(reactions, reaction)
	}

	return reactions, nil
}

func (s *reactionStore) Create(ctx context.Context, reaction types.Reaction) (types.Reaction, error) {
	result, err := s.Collection.InsertOne(ctx, reaction)
	if err != nil {
		return types.Reaction{}, err
	}

	// Retrieve the inserted document from the database using its ID
	var insertedReaction types.Reaction
	err = s.Collection.FindOne(ctx, bson.M{"_id": result.InsertedID}).Decode(&insertedReaction)
	if err != nil {
		return types.Reaction{}, err
	}

	// Return the inserted document
	return insertedReaction, nil
}

func (s *reactionStore) GetByID(ctx context.Context, id string) (types.Reaction, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return types.Reaction{}, err
	}

	var reaction types.Reaction
	err = s.Collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&reaction)
	if err != nil {
		return types.Reaction{}, err
	}

	return reaction, nil
}

func (s *reactionStore) DeleteByID(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectID}

	result, err := s.Collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}

func (s *reactionStore) UpdateByID(ctx context.Context, id string, fields types.UpdateReaction) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectID}

	updateFields := bson.M{"$set": fields}

	_, err = s.Collection.UpdateOne(ctx, filter, updateFields)
	if err != nil {
		return err
	}

	return nil
}

func (s *reactionStore) CheckUserReactWithTypeAndSourceID(
	ctx context.Context,
	reactionType string,
	sourceID primitive.ObjectID,
	userID primitive.ObjectID,
) (bool, error) {
	filter := bson.M{
		"type":      reactionType,
		"source_id": sourceID,
		"user_id":   userID,
	}

	count, err := s.Collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (s *reactionStore) GetByUserAndSource(
	ctx context.Context,
	reactionType string,
	sourceID primitive.ObjectID,
	userID primitive.ObjectID,
) (*types.Reaction, error) {
	filter := bson.M{
		"type":      reactionType,
		"source_id": sourceID,
		"user_id":   userID,
	}

	var reaction types.Reaction
	err := s.Collection.FindOne(ctx, filter).Decode(&reaction)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &reaction, nil
}
