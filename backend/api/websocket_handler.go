package api

import (
	"community-forum-backend/global"
	"community-forum-backend/types"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RegisterWebSocketRoutes(app *fiber.App) {
	app.Get("/websocket", websocket.New(handleWebSocket))
}

var WSConnectionManager = NewConnectionManager()

func handleWebSocket(c *websocket.Conn) {
	sessionId := c.Query("session_id") // Retrieve user ID from query parameters
	WSConnectionManager.AddConnection(sessionId, c)
	defer func() {
		WSConnectionManager.RemoveConnection(sessionId)
		c.Close()
	}()

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v\n", err)
			break
		}

		var wsMessageBody types.WebSocketMessage

		unmarshalErr := json.Unmarshal([]byte(msg), &wsMessageBody)
		if unmarshalErr != nil {
			log.Fatalf("Error converting string to map: %v", unmarshalErr)
		}

		log.Printf("WebSocket Message: %v\n", wsMessageBody)
		switch wsMessageBody.Type {
		case "join_to_topic":
			handleJoinToTopic(wsMessageBody.SessionId, wsMessageBody.RecipientID)
		case "leave_from_topic":
			handleLeaveFromTopic(wsMessageBody.SessionId)
		case "send_topic_reply":
			handleSentTopicReply(wsMessageBody)
		case "delete_topic_reply":
			handleDeleteTopicReply(wsMessageBody)
		case "edit_topic_reply":
			handleEditTopicReply(wsMessageBody)
		case "topic_reply_reaction":
			handleTopicReplyReaction(wsMessageBody)
		default:
			WSConnectionManager.BroadcastMessage(wsMessageBody)
		}
	}
}

type ConnectionManager struct {
	connections map[string]*websocket.Conn
	mu          sync.Mutex
}

func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		connections: make(map[string]*websocket.Conn),
	}
}

func (cm *ConnectionManager) AddConnection(sessionId string, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	cm.connections[sessionId] = conn
}

func (cm *ConnectionManager) RemoveConnection(sessionId string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	delete(cm.connections, sessionId)
}

func (cm *ConnectionManager) SendMessageToUser(recipientID string, msg []byte) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	conn, ok := cm.connections[recipientID]
	if !ok {
		return fiber.NewError(fiber.StatusNotFound, "Recipient not connected")
	}
	return conn.WriteMessage(websocket.TextMessage, msg)
}

func (cm *ConnectionManager) BroadcastMessage(wsMessageBody types.WebSocketMessage) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	for id, conn := range cm.connections {
		log.Printf("User Id: %v\n", id)
		topicId, ok := global.UserActiveInTopic[id]
		if ok || id == wsMessageBody.SenderID {
			var resMessage types.WebSocketMessage
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

func handleJoinToTopic(sessionId string, topicID string) {
	global.UserActiveInTopic[sessionId] = topicID
	global.GlobalTopic[topicID] = append(global.GlobalTopic[topicID], sessionId)

	log.Printf("User %s joined topic %s. Current users in topic: %v\n", sessionId, topicID, global.GlobalTopic[topicID])
}

func handleLeaveFromTopic(sessionId string) {
	topicID := global.UserActiveInTopic[sessionId]
	delete(global.UserActiveInTopic, sessionId)
	if users, exists := global.GlobalTopic[topicID]; exists {
		for i, id := range users {
			if id == sessionId {
				global.GlobalTopic[topicID] = append(users[:i], users[i+1:]...) // Remove the user by slicing
				log.Printf(
					"User %s left topic %s. Current users in topic: %v\n",
					sessionId,
					topicID,
					global.GlobalTopic[topicID],
				)
				return
			}
		}
	}
	log.Printf("User %s was not in topic %s.\n", sessionId, topicID)
}

func handleSentTopicReply(wsMessageBody types.WebSocketMessage) {
	var replyData types.CreateTopicReplyFromParams

	fmt.Printf("wsMessageBody.Data: %+v\n", wsMessageBody.Data)

	err := mapToStruct(wsMessageBody.Data, &replyData)
	if err != nil {
		fmt.Println("Failed to map to CreateTopicReply:", err)
		return
	}

	fmt.Printf("Mapped Data: %+v\n", replyData)
	senderID, err := primitive.ObjectIDFromHex(wsMessageBody.SenderID)
	if err != nil {
		fmt.Println("Invalid SenderID format:", err)
		return
	}
	updatedReply := types.CreateTopicReply{
		TopicID:  wsMessageBody.RecipientID,
		SentTime: time.Now(),
		Content:  replyData.Content,
		SenderID: senderID,
	}

	replie, err := Store.TopicReplies.Create(context.Background(), updatedReply)
	if err != nil {
		fmt.Println("Failed to create topic reply:", err)
		return
	}
	sender, getUserErr := Store.User.GetByID(context.Background(), wsMessageBody.SenderID)
	if getUserErr == nil {
		replie.Sender = sender
	}

	sentMessage := types.WebSocketSentMessage{
		Type: "recieves_topic_reply",
		Data: replie,
	}
	broadcastTopicReply(replie.TopicID, sentMessage)
}

func handleDeleteTopicReply(wsMessageBody types.WebSocketMessage) {
	var replyData types.CreateTopicReplyFromParams

	fmt.Printf("wsMessageBody.Data: %+v\n", wsMessageBody.Data)

	err := mapToStruct(wsMessageBody.Data, &replyData)
	if err != nil {
		fmt.Println("Failed to map to CreateTopicReply:", err)
		return
	}

	fmt.Printf("Mapped Data: %+v\n", replyData)

	replie, err := Store.TopicReplies.DeleteByID(context.Background(), wsMessageBody.RecipientID)

	if err != nil {
		fmt.Println("Failed to create topic reply:", err)
		return
	}

	sender, getUserErr := Store.User.GetByID(context.Background(), wsMessageBody.SenderID)
	if getUserErr == nil {
		replie.Sender = sender
	}

	sentMessage := types.WebSocketSentMessage{
		Type: "update_topic_reply",
		Data: replie,
	}
	broadcastTopicReply(replie.TopicID, sentMessage)
}

func handleEditTopicReply(wsMessageBody types.WebSocketMessage) {
	var replyData types.CreateTopicReplyFromParams

	fmt.Printf("wsMessageBody.Data: %+v\n", wsMessageBody.Data)

	err := mapToStruct(wsMessageBody.Data, &replyData)
	if err != nil {
		fmt.Println("Failed to map to CreateTopicReply:", err)
		return
	}

	fmt.Printf("Mapped Data: %+v\n", replyData)

	replie, err := Store.TopicReplies.UpdateByID(context.Background(), wsMessageBody.RecipientID, replyData.Content)

	if err != nil {
		fmt.Println("Failed to create topic reply:", err)
		return
	}

	sender, getUserErr := Store.User.GetByID(context.Background(), wsMessageBody.SenderID)
	if getUserErr == nil {
		replie.Sender = sender
	}

	sentMessage := types.WebSocketSentMessage{
		Type: "update_topic_reply",
		Data: replie,
	}
	broadcastTopicReply(replie.TopicID, sentMessage)
}

func handleTopicReplyReaction(wsMessageBody types.WebSocketMessage) {
	var replyData types.CreateTopicReplyReactionFromParams

	fmt.Printf("wsMessageBody.Data: %+v\n", wsMessageBody.Data)

	err := mapToStruct(wsMessageBody.Data, &replyData)
	if err != nil {
		fmt.Println("Failed to map to CreateTopicReply:", err)
		return
	}

	fmt.Printf("Mapped Data: %+v\n", replyData)

	recipientID, recipientIDErr := primitive.ObjectIDFromHex(wsMessageBody.RecipientID)
	if recipientIDErr != nil {
		fmt.Println("Invalid ObjectID:", err)
		return
	}
	userID, userIDErr := primitive.ObjectIDFromHex(wsMessageBody.SenderID)
	if userIDErr != nil {
		fmt.Println("Invalid ObjectID:", err)
		return
	}

	getReaction, getReactionErr := Store.Reactions.GetByUserAndSource(
		context.Background(),
		"topic_reply",
		recipientID,
		userID,
	)
	fmt.Println("Reaction:", getReaction == nil)
	// getReactionId = getReaction.ID
	if getReactionErr == nil && getReaction != nil {
		if replyData.Content == "" {
			reactionErr := Store.Reactions.DeleteByID(context.Background(), getReaction.ID.Hex())
			if reactionErr != nil {
				fmt.Println("Failed to delete topic reply reaction:", reactionErr)
				return
			}
		} else {
			reactionDoc := types.UpdateReaction{
				SourceID:  recipientID,
				Type:      "topic_reply",
				Reaction:  replyData.Content,
				ReactedAt: time.Now(),
			}

			reactionErr := Store.Reactions.UpdateByID(context.Background(), getReaction.ID.Hex(), reactionDoc)
			if reactionErr != nil {
				fmt.Println("Failed to update topic reply reaction:", reactionErr)
				return
			}
		}
	} else {
		reactionDoc := types.Reaction{
			SourceID:  recipientID,
			Type:      "topic_reply",
			Reaction:  replyData.Content,
			UserID:    userID,
			ReactedAt: time.Now(),
		}

		_, reactionErr := Store.Reactions.Create(context.Background(), reactionDoc)
		if reactionErr != nil {
			fmt.Println("Failed to create topic reply reaction:", reactionErr)
			return
		}
	}

	reply, replyErr := Store.TopicReplies.GetByID(context.Background(), wsMessageBody.RecipientID, userID)
	if replyErr != nil {
		fmt.Println("Failed to get topic reply :", replyErr)
		return
	}

	sentMessage := types.WebSocketSentMessage{
		Type: "update_topic_reply",
		Data: reply,
	}
	broadcastTopicReply(replyData.TopicID, sentMessage)
}

func broadcastTopicReply(topicID string, wsMessage types.WebSocketSentMessage) {
	users, exists := global.GlobalTopic[topicID]
	if !exists {
		log.Printf("No users are connected to topic %s.\n", topicID)
		return
	}
	for _, id := range users {
		marshalData, err := json.Marshal(wsMessage)
		if err != nil {
			log.Fatalf("Error converting struct to []byte: %v", err)
		}
		if err := WSConnectionManager.SendMessageToUser(id, marshalData); err != nil {
			log.Printf("Error sending WebSocket message to user %s: %v\n", id, err)
		}
	}
}

func mapToStruct(data map[string]interface{}, result interface{}) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return json.Unmarshal(jsonData, result)
}
