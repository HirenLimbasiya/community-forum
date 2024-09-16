package api

import (
	"community-forum-backend/types"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterTopicRoutes(app *fiber.App) {
	app.Get("/api/topics", handleGetTopics)
	app.Post("/api/topic", handleCreateTopic)
	app.Get("/api/topic/:id", handleGetTopic)
	app.Patch("/api/topic/:id", handleUpdateTopic)
	app.Delete("/api/topic/:id", handleDeleteTopic)
	app.Get("/api/topics/user", handleGetTopicsByUser)
}

func handleGetTopics(c *fiber.Ctx) error {
	topics, err := Store.Topic.Get(c.Context()) // Accessing Store directly
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(topics)
}

func handleCreateTopic(c *fiber.Ctx) error {
	var topic types.CreateTopic
	user := c.Locals("user").(types.UserResponse)
	if err := c.BodyParser(&topic); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	topic.CreatedBy = user.ID
	result, err := Store.Topic.Create(c.Context(), topic)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(result)
}

func handleGetTopic(c *fiber.Ctx) error {
	// Get the topic ID from the URL parameters
	topicID := c.Params("id")

	// Retrieve the topic from the database
	topic, err := Store.Topic.GetByID(c.Context(), topicID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get topic"})
	}

	// Return the retrieved topic
	return c.JSON(topic)
}

func handleDeleteTopic(c *fiber.Ctx) error {
	// Get the topic ID from the URL parameters
	topicID := c.Params("id")

	// Delete the topic from the database
	err := Store.Topic.DeleteByID(c.Context(), topicID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete topic"})
	}

	// Return success message
	return c.JSON(fiber.Map{"message": "Topic deleted successfully"})
}

func handleUpdateTopic(c *fiber.Ctx) error {
	// Get the topic ID from the URL parameters
	topicID := c.Params("id")

	// Get the updated topic data from the request body
	var body types.CreateTopic
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	existingTopic, err := Store.Topic.GetByID(c.Context(), topicID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve topic"})
	}

	// Create an updated topic object with values from the request body
	updatedTopic := types.CreateTopic{
		Title: strings.TrimSpace(body.Title),
		Body:  strings.TrimSpace(body.Body),
	}

	// If a field is empty in the request body, retain the existing value
	if updatedTopic.Title == "" {
		updatedTopic.Title = existingTopic.Title
	}
	if updatedTopic.Body == "" {
		updatedTopic.Body = existingTopic.Body
	}

	// Update the topic in the database
	err = Store.Topic.UpdateByID(c.Context(), topicID, updatedTopic)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update topic"})
	}

	// Return success message
	return c.JSON(fiber.Map{"message": "Topic updated successfully"})
}
func handleGetTopicsByUser(c *fiber.Ctx) error {
	// Get user from context (assumed to be set by auth middleware)
	user := c.Locals("user").(types.UserResponse)
	userID := user.ID

	// Retrieve topics created by this user from the database
	topics, err := Store.Topic.GetByUserID(c.Context(), userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No topics found for this user"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get topics"})
	}

	// Return the retrieved topics
	return c.JSON(topics)
}