package websocket

import (
	"community-forum-backend/global"
	"community-forum-backend/types"
	"encoding/json"
	"log"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func RegisterWebSocketRoutes(app *fiber.App) {
	app.Get("/api/websocket", websocket.New(handleWebSocket))
}

func handleWebSocket(c *websocket.Conn) {
	userID := c.Query("user_id") // Retrieve user ID from query parameters
	WSConnectionManager.AddConnection(userID, c)
	defer WSConnectionManager.RemoveConnection(userID)
	defer c.Close()

	// chack user in globalusers
	_, ok := global.UserActiveInTopic[userID]
	if !ok {
		// add user in globalusers
		global.UserActiveInTopic[userID] = ""
	}

	for {
		msgType, msg, err := c.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v\n", err)
			break
		}
		log.Printf("Received message from %s: %s\n %v", userID, msg, msgType)

		// Create a map to hold the dynamic data
		var wsMessageBody types.WebSocketMessage

		// Convert (unmarshal) JSON string into the map
		unmarshalErr := json.Unmarshal([]byte(msg), &wsMessageBody)
		if unmarshalErr != nil {
			log.Fatalf("Error converting string to map: %v", unmarshalErr)
		}

		// Print the result
		log.Printf("WebSocket Message: %v\n", wsMessageBody)

		// Broadcast the message to all connected users
		WSConnectionManager.BroadcastMessage(wsMessageBody)
	}
}

var WSConnectionManager = NewConnectionManager()

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
func (cm *ConnectionManager) BroadcastMessage(wsMessageBody types.WebSocketMessage) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	for id, conn := range cm.connections {

		// if user is online but not added in global UserActiveInTopic
		_, ok := global.UserActiveInTopic[id]
		if !ok {
			//  add in global UserActiveInTopic
			global.UserActiveInTopic[id] = ""
		}

		message, messageErr := generateMessage(id, wsMessageBody)
		if messageErr == nil && message != nil {
			if writeMessageError := conn.WriteMessage(websocket.TextMessage, message); writeMessageError != nil {
				// Handle error (e.g., log it, or remove the connection)
				conn.Close()
				delete(cm.connections, id)
			}
		}
	}
}

// generateMessage create a message for one user
func generateMessage(id string, wsMessageBody types.WebSocketMessage) ([]byte, error) {
	log.Printf("User Id: %v\n", id)
	//  Chack if user active send message
	topicId, ok := global.UserActiveInTopic[id]
	if ok || id == wsMessageBody.SenderID {
		var resMessage types.WebSocketMessage
		resMessage.Content = wsMessageBody.Content
		resMessage.SenderID = wsMessageBody.SenderID
		resMessage.RecipientID = wsMessageBody.RecipientID

		if topicId == wsMessageBody.RecipientID {
			resMessage.Type = "group_message"
		} else {
			resMessage.Type = "notification"
		}
		marshalData, err := json.Marshal(resMessage)
		if err != nil {
			log.Fatalf("Error converting struct to []byte: %v", err)
			return nil, err
		}

		return marshalData, nil
	}
	return nil, nil
}
