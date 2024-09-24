package api

import (
	"community-forum-backend/types"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterUserRoutes(app *fiber.App) {
	app.Get("/api/users", handleGetUsers)
	app.Get("/api/user/me", handleGetLoggedInUser)
	app.Get("/api/user/:id", handleGetUser)
	app.Patch("/api/user/:id", handleUpdateUser)
	app.Delete("/api/user/:id", handleDeleteUser)
}

func handleGetUsers(c *fiber.Ctx) error {
	users, err := Store.User.Get(c.Context()) // Accessing Store directly
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(users)
}

func handleGetUser(c *fiber.Ctx) error {
	userID := c.Params("id")
	user, err := Store.User.GetByID(c.Context(), userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user"})
	}
	return c.JSON(user)
}

func handleGetLoggedInUser(c *fiber.Ctx) error {
	user := c.Locals("user").(types.UserResponse)

	userData, err := Store.User.GetByID(c.Context(), user.ID.Hex())
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user"})
	}

	return c.JSON(userData)
}

func handleDeleteUser(c *fiber.Ctx) error {
	userID := c.Params("id")
	err := Store.User.DeleteByID(c.Context(), userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}
	return c.JSON(fiber.Map{"message": "User deleted successfully"})
}

func handleUpdateUser(c *fiber.Ctx) error {
	userID := c.Params("id")
	var body types.UserProfile
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	existingUser, err := Store.User.GetByID(c.Context(), userID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user"})
	}

	updatedUser := types.UpdateUser{
		Name:     strings.TrimSpace(body.Name),
		Email:    strings.TrimSpace(body.Email),
		Username: strings.TrimSpace(body.Username),
	}

	if updatedUser.Name == "" {
		updatedUser.Name = existingUser.Name
	}
	if updatedUser.Email == "" {
		updatedUser.Email = existingUser.Email
	}
	if updatedUser.Username == "" {
		updatedUser.Username = existingUser.Username
	}

	err = Store.User.UpdateByID(c.Context(), userID, updatedUser)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	return c.JSON(fiber.Map{"message": "User updated successfully"})
}
