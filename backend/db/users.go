package db

import (
	"context"

	"community-forum-backend/types"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserStore interface {
	Get(ctx context.Context) ([]types.UserResponse, error)
	Create(ctx context.Context, user types.CreateUser) (string, error)
	GetByID(ctx context.Context, id string) (types.UserResponse, error)
	UpdateByID(ctx context.Context, id string, user types.UpdateUser) error
	GetByEmail(ctx context.Context, email string) (types.User, error)
	GetByUsername(ctx context.Context, email string) (types.User, error)
	DeleteByID(ctx context.Context, id string) error
}

type userStore struct {
	Collection *mongo.Collection
}

func NewUserStore(collection *mongo.Collection) UserStore {
	return &userStore{Collection: collection}
}

func (s *userStore) Get(ctx context.Context) ([]types.UserResponse, error) {
	cursor, err := s.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []types.UserResponse
	for cursor.Next(ctx) {
		var user types.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		userResponse := types.UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		}
		users = append(users, userResponse)
	}

	return users, nil
}

func (s *userStore) Create(ctx context.Context, user types.CreateUser) (string, error) {
	result, err := s.Collection.InsertOne(ctx, user)
	if err != nil {
		return "", err
	}
	return result.InsertedID.(primitive.ObjectID).Hex(), nil
}

func (s *userStore) GetByID(ctx context.Context, id string) (types.UserResponse, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return types.UserResponse{}, err
	}

	var user types.User
	err = s.Collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		return types.UserResponse{}, err
	}

	userResponse := types.UserResponse{
		ID:       user.ID,
		Name:     user.Name,
		Email:    user.Email,
		Username: user.Username,
	}

	return userResponse, nil
}

func (s *userStore) DeleteByID(ctx context.Context, id string) error {
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

func (s *userStore) UpdateByID(ctx context.Context, id string, fields types.UpdateUser) error {
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

func (s *userStore) GetByEmail(ctx context.Context, email string) (types.User, error) {
	var user types.User
	err := s.Collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return types.User{}, err
	}
	return user, nil
}

func (s *userStore) GetByUsername(ctx context.Context, username string) (types.User, error) {
	var user types.User
	err := s.Collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		return types.User{}, err
	}
	return user, nil
}
