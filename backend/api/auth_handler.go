package api

import (
	"community-forum-backend/types"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func RegisterAuthRoutes(app *fiber.App) {
	app.Post("/api/registeruser", handleRegister)
	app.Post("/api/login", handleLogin)
}

func handleRegister(c *fiber.Ctx) error {
	var user types.CreateUser
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Check if email already exists
	_, err := Store.User.GetByEmail(c.Context(), user.Email)
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email already in use"})
	} else if err != mongo.ErrNoDocuments {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to check email"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	user.Password = string(hashedPassword)

	userID, err := Store.User.Create(c.Context(), user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	token, err := GenerateJWT(userID, user.Name, user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": token})
}

func handleLogin(c *fiber.Ctx) error {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	user, err := Store.User.GetByEmail(c.Context(), loginData.Email)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	token, err := GenerateJWT(user.ID.Hex(), user.Name, user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": token})
}
