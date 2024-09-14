package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"community-forum-backend/api"
	"community-forum-backend/db"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// MongoDB setup
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	database := client.Database("mydb")
	store := db.NewStore(database)

	// Register central store
	api.RegisterStore(store)

	// Fiber app setup
	app := fiber.New()

	api.RegisterRoutes(app)

	fmt.Println("Server is running on port 8080")
	log.Fatal(app.Listen(":8080"))
}
