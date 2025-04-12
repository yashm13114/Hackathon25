import React, { useEffect } from 'react';
import ChatRoom from './ChatRoom';
import VoiceChat from './VoiceChat';
import BotManager from './BotManager';

export default function StudentComponent() {
  useEffect(() => {
    console.log("Student component loaded");
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Group Discussion Room</h1>
      <VoiceChat />
      <ChatRoom />
      <BotManager />
    </div>
  );
}
