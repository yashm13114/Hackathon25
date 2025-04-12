// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import { Mic, MicOff, Send } from 'lucide-react';

// const socket = io('http://localhost:3000');

// const LiveRoom = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [isVoiceActive, setIsVoiceActive] = useState(false);
//   const messageInputRef = useRef(null);

//   useEffect(() => {
//     socket.on('chat message', (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.off('chat message');
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       socket.emit('chat message', message);
//       setMessage('');
//       messageInputRef.current.focus();
//     }
//   };

//   const handleVoiceToggle = () => {
//     setIsVoiceActive((prev) => !prev);
//     // WebRTC logic goes here
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
//       <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-4 text-xl font-bold">
//           Live Discussion Room
//         </div>

//         {/* Chat Messages */}
//         <div className="p-4 h-[400px] overflow-y-auto space-y-2 bg-gray-50">
//           {messages.map((msg, index) => (
//             <div key={index} className="bg-blue-100 p-2 rounded-xl w-fit max-w-xs">
//               {msg}
//             </div>
//           ))}
//         </div>

//         {/* Chat Input */}
//         <div className="flex items-center border-t p-4 gap-2 bg-white">
//           <input
//             ref={messageInputRef}
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//             placeholder="Type your message..."
//             className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
//           >
//             <Send size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Voice Chat */}
//       <div className="mt-6">
//         <button
//           onClick={handleVoiceToggle}
//           className={`flex items-center gap-2 px-6 py-2 rounded-full text-white shadow-md transition ${
//             isVoiceActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
//           }`}
//         >
//           {isVoiceActive ? <MicOff size={20} /> : <Mic size={20} />}
//           {isVoiceActive ? 'Disable Voice Chat' : 'Enable Voice Chat'}
//         </button>

//         {isVoiceActive && (
//           <div className="mt-4 p-4 bg-white rounded-xl shadow w-full max-w-md text-center">
//             <p className="text-gray-700 font-medium">Voice Chat Active</p>
//             {/* Placeholder for WebRTC/Agora/Twilio */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LiveRoom;
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Mic, MicOff, Send } from 'lucide-react';

const socket = io('http://localhost:3000');

const LiveRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const interimTranscriptRef = useRef('');

  useEffect(() => {
    const name = prompt("Enter your username") || "Anonymous";
    setUsername(name);

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = () => {
    const finalMsg = message.trim();
    if (finalMsg) {
      socket.emit('chat message', `${username}: ${finalMsg}`);
      setMessage('');
    }
  };

  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    if (!isVoiceActive) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('🎤 Voice recognition started');
        setIsSpeaking(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          interimTranscriptRef.current = interimTranscript;
          setMessage((prev) => prev + interimTranscript);
        }

        if (finalTranscript) {
          setMessage((prev) => prev + finalTranscript);
          interimTranscriptRef.current = '';
        }
      };

      recognition.onerror = (e) => {
        console.error('❌ Speech Error:', e.error);
      };

      recognition.onend = () => {
        console.log('🛑 Voice recognition ended');
        setIsSpeaking(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    }

    setIsVoiceActive((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 text-center font-bold text-xl">
          Live Discussion Room
        </div>

        <div className="h-[400px] overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className="bg-blue-100 px-3 py-2 rounded-xl w-fit max-w-xs">
              {msg}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t p-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isSpeaking ? 'Listening...' : 'Type or speak...'}
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleVoiceToggle}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-white shadow-md transition ${
            isVoiceActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isVoiceActive ? <MicOff size={20} /> : <Mic size={20} />}
          {isVoiceActive ? 'Disable Voice Typing' : 'Enable Voice Typing'}
        </button>
        {isSpeaking && (
          <div className="mt-2 text-sm text-gray-700 animate-pulse">🎤 Listening...</div>
        )}
      </div>
    </div>
  );
};

export default LiveRoom;
