import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://10.200.17.94:3000/");

export default function BotManager() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("room1"); // Room for chat

  // Handle incoming messages
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: data.sender, message: data.message },
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send-message", { user: "User", message, roomId });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "User", message },
      ]);
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div>
      <div>
        <h2>Chat Room</h2>
        <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc' }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> <span>{msg.message}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
