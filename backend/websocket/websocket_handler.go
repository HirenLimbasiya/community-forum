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
	app.Get("/websocket", websocket.New(handleWebSocket))
}
var WSConnectionManager = NewConnectionManager()

func handleWebSocket(c *websocket.Conn) {
	userID := c.Query("user_id") // Retrieve user ID from query parameters
	WSConnectionManager.AddConnection(userID, c)
	defer WSConnectionManager.RemoveConnection(userID)
	defer c.Close()

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
		switch wsMessageBody.Type {
        case "join_to_topic":
            handleJoinToTopic(wsMessageBody.SenderID, wsMessageBody.RecipientID)
		case "leave_from_topic":
            handleLeaveFromTopic(wsMessageBody.SenderID, wsMessageBody.RecipientID)
		case "message":
            handleMessage(wsMessageBody)
        default:
			WSConnectionManager.BroadcastMessage(wsMessageBody)
        }
		// Broadcast the message to all connected users
	}
}


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
			}

			if err := conn.WriteMessage(websocket.TextMessage, marshalData); err != nil {
				conn.Close()
				delete(cm.connections, id)
			}
		}
	}
}

func handleJoinToTopic(userID string, topicID string) {
    global.UserActiveInTopic[userID] = topicID 
    global.GlobalTopic[topicID] = append(global.GlobalTopic[topicID], userID)

    log.Printf("User %s joined topic %s. Current users in topic: %v\n", userID, topicID, global.GlobalTopic[topicID])
}

func handleLeaveFromTopic(userID string, topicID string) {
    delete(global.UserActiveInTopic, userID)
    // Find and remove user from the topic's user array
    if users, exists := global.GlobalTopic[topicID]; exists {
        for i, id := range users {
            if id == userID {
                global.GlobalTopic[topicID] = append(users[:i], users[i+1:]...) // Remove the user by slicing
                log.Printf("User %s left topic %s. Current users in topic: %v\n", userID, topicID, global.GlobalTopic[topicID])
                return
            }
        }
    }
    log.Printf("User %s was not in topic %s.\n", userID, topicID)
}

func handleMessage(wsMessageBody types.WebSocketMessage) {
    topicID := wsMessageBody.RecipientID // This is the topic ID
    messageContent := wsMessageBody.Content.Message // Get the message content

    // Check if the topic exists in GlobalTopic
    if users, exists := global.GlobalTopic[topicID]; exists {
        // Broadcast the message to all users in the topic
        for _, userID := range users {
            // Create a message to send
            responseMessage := types.WebSocketMessage{
                Type:        "message", // Message type to be sent back
                SenderID:   wsMessageBody.SenderID,
                RecipientID: topicID,
            }
			responseMessage.Content.Message = messageContent
            // Convert the message to JSON
            marshalData, err := json.Marshal(responseMessage)
            if err != nil {
                log.Printf("Error marshaling response message: %v", err)
                continue
            }

            // Send the message to the user
            err = WSConnectionManager.SendMessageToUser(userID, marshalData)
            if err != nil {
                log.Printf("Error sending message to user %s: %v", userID, err)
            }
        }
    } else {
        log.Printf("Topic %s does not exist. Unable to send message.\n", topicID)
    }
}
