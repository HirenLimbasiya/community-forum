package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

type FileUploadStore interface {
	Get(ctx context.Context, letter string) (string, error)
}

type fileUploadStore struct {
	Collection *mongo.Collection
}

func NewFileUploadStore(collection *mongo.Collection) FileUploadStore {
	return &fileUploadStore{Collection: collection}
}

func (s *fileUploadStore) Get(ctx context.Context, letter string) (string, error) {
	return "", nil
}
