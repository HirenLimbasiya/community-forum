package api

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	RegisterAuthRoutes(app)
	app.Use(authMiddleware)
	RegisterUserRoutes(app)
	RegisterTopicRoutes(app)
	RegisterTopicReplyRoutes(app)
	RegisterReactionRoutes(app)
}
