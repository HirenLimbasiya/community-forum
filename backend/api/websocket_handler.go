package api

import (
	"log"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func RegisterWebSocketRoutes(app *fiber.App) {
	app.Post("/api/websocket", websocket.New(handleWebSocket))
}

func handleWebSocket(c *websocket.Conn) {
	userID := c.Query("user_id") // Retrieve user ID from query parameters
	connectionManager.AddConnection(userID, c)
	defer connectionManager.RemoveConnection(userID)
	defer c.Close()

	for {
		msgType, msg, err := c.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v\n", err)
			break
		}
		log.Printf("Received message from %s: %s\n %v", userID, msg, msgType)

		// Broadcast the message to all connected users
		connectionManager.BroadcastMessage(msg)
	}
}

var connectionManager = NewConnectionManager()

// ConnectionManager manages WebSocket connections
type ConnectionManager struct {
	connections map[string]*websocket.Conn
	mu          sync.Mutex
}

// NewConnectionManager creates a new ConnectionManager
func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		connections: make(map[string]*websocket.Conn),
	}
}

// AddConnection adds a new WebSocket connection
func (cm *ConnectionManager) AddConnection(userID string, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	cm.connections[userID] = conn
}

// RemoveConnection removes a WebSocket connection
func (cm *ConnectionManager) RemoveConnection(userID string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	delete(cm.connections, userID)
}

// SendMessageToUser sends a message from the sender to a specific recipient
func (cm *ConnectionManager) SendMessageToUser(recipientID string, msg []byte) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	conn, ok := cm.connections[recipientID]
	if !ok {
		return fiber.NewError(fiber.StatusNotFound, "Recipient not connected")
	}
	return conn.WriteMessage(websocket.TextMessage, msg)
}

// BroadcastMessage sends a message to all connected users
func (cm *ConnectionManager) BroadcastMessage(msg []byte) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	for id, conn := range cm.connections {
		log.Printf("User Id: %v\n", id)
		if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			// Handle error (e.g., log it, or remove the connection)
			conn.Close()
			delete(cm.connections, id)
		}
	}
}
