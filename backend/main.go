package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"community-forum-backend/api"
	"community-forum-backend/db"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable is not set")
	}
	
	// MongoDB setup
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
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

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3001",
		AllowMethods: "GET,POST,PUT,DELETE, PATCH",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization", // Include Authorization header
	}))

	api.RegisterRoutes(app)

	fmt.Println("Server is running on port 8080")
	log.Fatal(app.Listen(":8080"))
}
