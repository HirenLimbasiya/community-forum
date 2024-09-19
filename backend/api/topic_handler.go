package api

import (
	"community-forum-backend/types"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterTopicRoutes(app *fiber.App) {
	app.Get("/api/topics", handleGetTopics)
	app.Post("/api/topic", handleCreateTopic)
	app.Get("/api/topic/:id", handleGetTopic)
	app.Patch("/api/topic/:id", handleUpdateTopic)
	app.Delete("/api/topic/:id", handleDeleteTopic)
	app.Get("/api/topics/user", handleGetTopicsByUser)
	app.Get("/api/topics/user/:userId", handleGetAllTopicsByUserID) // New endpoint
	app.Patch("/api/topic/:id/close", handleCloseTopic) // New endpoint to close a topic
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
	topicID := c.Params("id")

	topic, err := Store.Topic.GetByID(c.Context(), topicID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get topic"})
	}

	return c.JSON(topic)
}

func handleDeleteTopic(c *fiber.Ctx) error {
	topicID := c.Params("id")

	err := Store.Topic.DeleteByID(c.Context(), topicID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete topic"})
	}

	return c.JSON(fiber.Map{"message": "Topic deleted successfully"})
}

func handleUpdateTopic(c *fiber.Ctx) error {
	topicID := c.Params("id")

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

	updatedTopic := types.CreateTopic{
		Title: strings.TrimSpace(body.Title),
		Body:  strings.TrimSpace(body.Body),
	}

	if updatedTopic.Title == "" {
		updatedTopic.Title = existingTopic.Title
	}
	if updatedTopic.Body == "" {
		updatedTopic.Body = existingTopic.Body
	}

	err = Store.Topic.UpdateByID(c.Context(), topicID, updatedTopic)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update topic"})
	}

	return c.JSON(fiber.Map{"message": "Topic updated successfully"})
}

func handleGetTopicsByUser(c *fiber.Ctx) error {
	user := c.Locals("user").(types.UserResponse)
	userID := user.ID

	topics, err := Store.Topic.GetByUserID(c.Context(), userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No topics found for this user"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get topics"})
	}

	return c.JSON(topics)
}

// New handler to get topics by user ID from the URL parameter
func handleGetAllTopicsByUserID(c *fiber.Ctx) error {
	userID := c.Params("userId")

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID format"})
	}

	topics, err := Store.Topic.GetByUserID(c.Context(), objectID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No topics found for this user"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get topics"})
	}

	return c.JSON(topics)
}

func handleCloseTopic(c *fiber.Ctx) error {
	topicID := c.Params("id")

	err := Store.Topic.CloseByID(c.Context(), topicID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to close topic"})
	}

	return c.JSON(fiber.Map{"message": "Topic closed successfully"})
}
