// ChatBox.js
import React, { useState, useEffect } from 'react';

const ChatRoom = ({ selectedGdTopic }) => {
  const [messages, setMessages] = useState([
    { text: 'Welcome to the Group Discussion!', from: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, from: 'user' },
      ]);
      setInputMessage('');
    }
  };

  useEffect(() => {
    if (selectedGdTopic) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Let's discuss the topic: "${selectedGdTopic}"`, from: 'bot' },
      ]);
    }
  }, [selectedGdTopic]);

  return (
    <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Chatbox</h2>
      <div className="space-y-4 h-64 overflow-y-auto border border-gray-300 p-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.from === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                message.from === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded"
          placeholder="Type your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
