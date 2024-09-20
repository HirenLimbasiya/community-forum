package api

import (
	"community-forum-backend/types"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterReactionRoutes(app *fiber.App) {
	app.Post("/api/reaction", handleCreateReaction)
	app.Delete("/api/reaction/:id", handleDeleteReaction)
	app.Get("/api/reactions", handleGetAllReactions)
	// app.Get("/api/:source_id/reactions", handleGetReactions)
}

func handleCreateReaction(c *fiber.Ctx) error {
	// replyID := c.Params("source_id")
	user := c.Locals("user").(types.UserResponse)

	var reaction types.CreateReaction
	if err := c.BodyParser(&reaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if reaction.SourceID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid reply ID"})
	}

	if reaction.Type == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid type selected"})
	}

	if reaction.Reaction == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid emoji selected"})
	}

	allowedEmojis := map[string]bool{
		"❤️": true,
		"👍":  true,
		"😂":  true,
		"😍":  true,
		"😯":  true,
		"😥":  true,
		"🥳":  true,
	}

	// Check if the selected emoji is in the allowed list
	if !allowedEmojis[reaction.Reaction] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid emoji selected"})
	}

	var validSourceID bool
	switch reaction.Type {
	case "topic_reply":
		_, err := Store.TopicReplies.GetByID(c.Context(), reaction.SourceID, user.ID)
		if err == nil {
			validSourceID = true
		}
	default:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid reaction type"})
	}

	if !validSourceID {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid source ID for the given type"})
	}

	sourceyObjID, err := primitive.ObjectIDFromHex(reaction.SourceID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid reply ID"})
	}

	// Check if the user has already reacted with the given type and source ID
	existingReaction, err := Store.Reactions.GetByUserAndSource(c.Context(), reaction.Type, sourceyObjID, user.ID)
	if err != nil && err != mongo.ErrNoDocuments {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to check user reaction"})
	}

	if existingReaction != nil {
		updateData := types.UpdateReaction{
			Reaction:  reaction.Reaction,
			SourceID:  sourceyObjID,
			Type:      reaction.Type,
			ReactedAt: time.Now(),
		}
		err := Store.Reactions.UpdateByID(c.Context(), existingReaction.ID.Hex(), updateData)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update reaction"})
		}
		return c.JSON(fiber.Map{"message": "Reaction updated"})
	}

	reactionDoc := types.Reaction{
		SourceID:  sourceyObjID,
		Type:      reaction.Type,
		Reaction:  reaction.Reaction,
		UserID:    user.ID,
		ReactedAt: time.Now(),
	}

	reactionID, err := Store.Reactions.Create(c.Context(), reactionDoc)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add reaction"})
	}

	return c.JSON(fiber.Map{"data": reactionID})
}

func handleDeleteReaction(c *fiber.Ctx) error {
	// Get the reaction ID from the URL parameters
	reactionID := c.Params("id")

	// Delete the reaction from the database
	err := Store.Reactions.DeleteByID(c.Context(), reactionID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Reaction not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete reaction"})
	}

	// Return success message
	return c.JSON(fiber.Map{"message": "Reaction deleted successfully"})
}

func handleGetAllReactions(c *fiber.Ctx) error {
	reactions, err := Store.Reactions.Get(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve reactions"})
	}

	return c.JSON(fiber.Map{"data": reactions})
}

// func handleGetReactions(c *fiber.Ctx) error {
// 	replyID := c.Params("source_id")

// 	reactions, err := Store.Reactions.GetByReplyID(c.Context(), replyID)
// 	if err != nil {
// 		if err == mongo.ErrNoDocuments {
// 			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No reactions found for the reply"})
// 		}
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	return c.JSON(reactions)
// }
