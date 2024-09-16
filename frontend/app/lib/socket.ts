// lib/socket.ts

import { addSingleTopicReplyToStore } from "../slices/singleTopicSlice";
import store from "../store/store";

// import store from "../store/store"; // Import the Redux storeap

let socket: WebSocket | null = null;
const NEXT_PUBLIC_WS_URL = process.env.NEXT_PUBLIC_WS_URL;
const connectSocket = (userId: string) => {
  socket = new WebSocket(`${NEXT_PUBLIC_WS_URL}/websocket?user_id=${userId}`);

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
  const data = JSON.parse(event.data);
  console.log("Received message:", data);

  // Dispatch the action to Redux store
  if (data.type === "message") {
    store.dispatch(addSingleTopicReplyToStore(data.content.message));
    // store.dispatch(addMessage(data.content)); // Update the store with the received message content
  }
};

interface Content {
  message: string;
}

interface SocketSendMessage {
  sender_id: string;
  recipient_id: string;
  content: Content;
  type: string;
}

const sendSocketMessage = (message: SocketSendMessage) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
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
