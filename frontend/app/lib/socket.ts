// lib/socket.ts

import {
  addSingleTopicReplyToStore,
  updateSingleTopicReplyToStore,
} from "../slices/singleTopicSlice";
import store from "../store/store";
import { TopicReply } from "../types/topic";

// import store from "../store/store"; // Import the Redux storeap

let socket: WebSocket | null = null;
const NEXT_PUBLIC_WS_URL = process.env.NEXT_PUBLIC_WS_URL;
let sessionId: string = "";

const generateSessionId = () => {
  return `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
};

const connectSocket = () => {
  sessionId = generateSessionId();

  socket = new WebSocket(
    `${NEXT_PUBLIC_WS_URL}/websocket?session_id=${sessionId}`
  );

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onmessage = (event) => {
    handleMessage(event);
  };
};

const handleMessage = (event: MessageEvent) => {
  const message = JSON.parse(event.data);
  console.log("Received message:", message);

  // Dispatch the action to Redux store
  if (message.type === "recieves_topic_reply") {
    const reply: TopicReply = message.data;
    store.dispatch(addSingleTopicReplyToStore(reply));
  }
  if (message.type === "update_topic_reply") {
    const reply: TopicReply = message.data;
    store.dispatch(updateSingleTopicReplyToStore(reply));
  }
};

export interface SocketSendMessage<T = unknown> {
  sender_id?: string;
  recipient_id: string;
  session_id?: string;
  data?: T;
  type:
    | "join_to_topic"
    | "leave_from_topic"
    | "send_topic_reply"
    | "delete_topic_reply"
    | "edit_topic_reply"
    | "topic_reply_reaction";
}

const sendSocketMessage = (message: SocketSendMessage) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const token = localStorage.getItem("token") || "";
    const payload = token.split(".")[1]; // Get the payload part of the JWT
    const decodedPayload = JSON.parse(atob(payload)); // Decode base64 and parse JSON

    const userId = decodedPayload.id;
    message.sender_id = userId;
    message.session_id = sessionId;
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not connected. Unable to send message.");
  }
};

const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export { connectSocket, disconnectSocket, sendSocketMessage };
