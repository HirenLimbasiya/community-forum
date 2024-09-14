package api

import (
	"community-forum-backend/websocket"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	websocket.RegisterWebSocketRoutes(app)
	RegisterAuthRoutes(app)
	app.Use(authMiddleware)
	RegisterUserRoutes(app)
	RegisterTopicRoutes(app)
	RegisterTopicReplyRoutes(app)
	RegisterReactionRoutes(app)
}
