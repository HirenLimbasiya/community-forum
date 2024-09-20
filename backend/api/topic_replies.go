package api

import (
	"community-forum-backend/types"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterTopicReplyRoutes(app *fiber.App) {
	app.Post("/api/topic/:id/replies", handleCreateTopicReply)
	app.Get("/api/topic/:id/replies", handleGetTopicReplies)
	app.Get("/api/reply/:id", handleGetReplyByID)
}

func handleCreateTopicReply(c *fiber.Ctx) error {
	topicID := c.Params("id")
	user := c.Locals("user").(types.UserResponse)

	// Get the current time
	sentTime := time.Now()

	// Check if the topic exists
	_, err := Store.Topic.GetByID(c.Context(), topicID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Topic not found, return appropriate response
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Topic not found"})
		}
		// Other error occurred, return internal server error response
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve topic"})
	}

	var reply types.CreateTopicReplyFromParams
	if err := c.BodyParser(&reply); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	updatedReply := types.CreateTopicReply{
		TopicID:  topicID,
		SentTime: sentTime,
		Content:  reply.Content,
		SenderID: user.ID,
	}
	// Additional validation if needed

	replyID, err := Store.TopicReplies.Create(c.Context(), updatedReply)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"reply_id": replyID})
}

func handleGetTopicReplies(c *fiber.Ctx) error {
	topicID := c.Params("id")
	user := c.Locals("user").(types.UserResponse)

	replies, err := Store.TopicReplies.GetByTopicID(c.Context(), topicID, user.ID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No replies found for the topic"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(replies)
}

func handleGetReplyByID(c *fiber.Ctx) error {
	replyID := c.Params("id")
	user := c.Locals("user").(types.UserResponse)


	// Fetch the reply by its ID from the database
	reply, err := Store.TopicReplies.GetByID(c.Context(), replyID, user.ID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Reply not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(reply)
}
