import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Mic, MicOff, Send, Video, VideoOff, Users } from "lucide-react";

const socket = io("http://localhost:3000");

const LiveRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [peers, setPeers] = useState({});
  const [participants, setParticipants] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [error, setError] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const recognitionRef = useRef(null);
  const interimTranscriptRef = useRef("");
  const peerConnections = useRef({});
  const localStream = useRef(null);

  useEffect(() => {
    const name = prompt("Enter your name") || "Anonymous";
    setUsername(name);

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // WebRTC signaling handlers
    socket.on("offer", (id, description) => {
      handleOffer(id, description);
    });

    socket.on("answer", (id, description) => {
      handleAnswer(id, description);
    });

    socket.on("candidate", (id, candidate) => {
      handleCandidate(id, candidate);
    });

    socket.on("user-connected", (userId) => {
      setParticipants((prev) => [...prev, userId]);
      createPeerConnection(userId);
    });

    socket.on("user-disconnected", (userId) => {
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
        setPeers((prev) => {
          const newPeers = { ...prev };
          delete newPeers[userId];
          return newPeers;
        });
      }
      setParticipants((prev) => prev.filter((id) => id !== userId));
    });

    socket.on("existing-users", (userIds) => {
      setParticipants(userIds);
      userIds.forEach((userId) => {
        if (userId !== socket.id) {
          createPeerConnection(userId);
        }
      });
    });

    // Get existing users when joining
    socket.emit("get-users");

    return () => {
      socket.off("chat message");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("existing-users");

      // Clean up media streams
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
      Object.values(peerConnections.current).forEach((pc) => pc.close());
    };
  }, []);

  const handleSendMessage = () => {
    const finalMsg = message.trim();
    if (finalMsg) {
      socket.emit("chat message", `${username}: ${finalMsg}`);
      setMessage("");
    }
  };

  const handleVoiceToggle = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (!isVoiceActive) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsSpeaking(true);

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          interimTranscriptRef.current = interim;
          setMessage((prev) => prev + interim);
        }

        if (final) {
          setMessage((prev) => prev + final);
          interimTranscriptRef.current = "";
        }
      };

      recognition.onerror = (e) => {
        console.error("Speech Error:", e.error);
        if (e.error === "not-allowed") {
          setCameraPermissionDenied(true);
        }
      };
      recognition.onend = () => setIsSpeaking(false);

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    }

    setIsVoiceActive((prev) => !prev);
  };

  const requestMediaPermission = async (audioOnly = false) => {
    try {
      setCameraPermissionDenied(false);
      setError(null);
      const constraints = {
        audio: true,
        video: !audioOnly
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            }
          : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStream.current = stream;

      if (!audioOnly) {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          
          // Add event listeners to handle video playback
          localVideoRef.current.onloadedmetadata = () => {
            localVideoRef.current.play().catch((e) => {
              console.error("Video play error:", e);
              setError("Failed to play video stream");
            });
          };
          
          localVideoRef.current.onerror = (e) => {
            console.error("Video element error:", e);
            setError("Video element encountered an error");
          };
          
          // Force play in case onloadedmetadata doesn't fire
          setTimeout(() => {
            if (localVideoRef.current && localVideoRef.current.paused) {
              localVideoRef.current.play().catch(e => {
                console.error("Fallback video play error:", e);
                setError("Fallback play failed");
              });
            }
          }, 500);
        }
        setIsVideoActive(true);
      } else {
        setAudioOnlyMode(true);
      }

      setPermissionGranted(true);

      // Initialize peer connections for all existing users
      socket.emit("get-users");
    } catch (err) {
      console.error("Error accessing media devices:", err);
      if (err.name === "NotAllowedError") {
        setCameraPermissionDenied(true);
        alert(
          "Please allow camera and microphone permissions in your browser settings."
        );
      } else if (err.name === "NotFoundError") {
        alert("No camera found. Please check your camera connection.");
      } else {
        alert("Could not access camera/microphone. Please check your devices.");
      }
    }
  };

  const stopMedia = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      localStream.current = null;
    }
    setIsVideoActive(false);
    setPermissionGranted(false);
    setAudioOnlyMode(false);
    setError(null);

    // Close all peer connections
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};
    setPeers({});
  };

  const createPeerConnection = (userId) => {
    if (peerConnections.current[userId] || userId === socket.id) return;

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", userId, event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      setPeers((prev) => {
        // Check if we already have this stream
        if (prev[userId] && prev[userId].id === event.streams[0].id) {
          return prev;
        }
        return {
          ...prev,
          [userId]: event.streams[0],
        };
      });
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream.current);
      });
    }

    peerConnections.current[userId] = peerConnection;

    // Only create offer if we're the newer peer
    if (userId < socket.id) {
      createOffer(userId);
    }
  };

  const createOffer = async (userId) => {
    const peerConnection = peerConnections.current[userId];
    if (!peerConnection) return;

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", userId, offer);
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const handleOffer = async (userId, description) => {
    await createPeerConnection(userId);
    const peerConnection = peerConnections.current[userId];

    try {
      await peerConnection.setRemoteDescription(description);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", userId, answer);
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const handleAnswer = async (userId, description) => {
    const peerConnection = peerConnections.current[userId];
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(description);
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    }
  };

  const handleCandidate = async (userId, candidate) => {
    const peerConnection = peerConnections.current[userId];
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    }
  };

  const renderVideoOrPlaceholder = (userId, stream) => {
    const hasVideo = stream?.getVideoTracks().length > 0;

    if (hasVideo) {
      return (
        <video
          ref={(ref) => {
            if (ref && stream) {
              ref.srcObject = stream;
              remoteVideoRefs.current[userId] = ref;
              ref.play().catch(e => console.error("Remote video play error:", e));
            }
          }}
          autoPlay
          playsInline
          className="w-full h-48 bg-black rounded-lg object-cover"
          onError={(e) => console.error("Remote video error:", e)}
        />
      );
    } else {
      return (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users size={24} className="text-white" />
            </div>
            <p className="text-gray-700">Audio only</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Top Nav Buttons */}
      <div className="flex items-center justify-between bg-white shadow-md py-3 px-6">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <span className="font-medium">
            {participants.length + 1} Participants
          </span>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            GD
          </button>
          <button className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600">
            PI
          </button>
          <button className="px-4 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600">
            Discussion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        {/* Video Section */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 text-center font-bold">
            Video Conference
          </div>
          <div className="p-4 h-full">
            {!permissionGranted ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-700 mb-4">
                  Join the conference with audio and/or video
                </p>
                {cameraPermissionDenied && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
                    <p>
                      Camera permission denied. Please allow access in your
                      browser settings.
                    </p>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => requestMediaPermission(false)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition"
                  >
                    <Video size={20} />
                    Join with Video
                  </button>
                  <button
                    onClick={() => requestMediaPermission(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-md transition"
                  >
                    <Mic size={20} />
                    Join Audio Only
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Local Video/Audio */}
                <div className="border rounded-lg p-2 bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    You ({username})
                  </div>
                  {isVideoActive ? (
                    <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Video error:", e);
                          setError("Failed to display video feed");
                        }}
                        onCanPlay={() => {
                          console.log("Video can play");
                          localVideoRef.current?.play().catch((e) => {
                            console.error("Video play error:", e);
                          });
                        }}
                      />
                      {error && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center text-white">
                          {error}
                        </div>
                      )}
                      {!localVideoRef.current?.srcObject?.active && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          Loading camera feed...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Mic size={24} className="text-white" />
                        </div>
                        <p className="text-gray-700">Microphone active</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remote Videos/Audio */}
                {Object.entries(peers).map(([userId, stream]) => (
                  <div
                    key={userId}
                    className="border rounded-lg p-2 bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Participant
                    </div>
                    {renderVideoOrPlaceholder(userId, stream)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 text-center font-bold">
            Live Chat
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-xl w-fit max-w-xs ${
                  msg.startsWith(`${username}:`)
                    ? "bg-blue-100 ml-auto"
                    : "bg-purple-100"
                }`}
              >
                {msg}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t p-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={isSpeaking ? "Listening..." : "Type or speak..."}
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 p-4">
        {permissionGranted ? (
          <button
            onClick={stopMedia}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition"
          >
            {isVideoActive ? <VideoOff size={20} /> : <MicOff size={20} />}
            {isVideoActive ? "Stop Video" : "Leave Call"}
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => requestMediaPermission(false)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition"
            >
              <Video size={20} />
              Join with Video
            </button>
            <button
              onClick={() => requestMediaPermission(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-md transition"
            >
              <Mic size={20} />
              Join Audio Only
            </button>
          </div>
        )}
        <button
          onClick={handleVoiceToggle}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-white shadow-md transition ${
            isVoiceActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isVoiceActive ? <MicOff size={20} /> : <Mic size={20} />}
          {isVoiceActive ? "Disable Voice Typing" : "Enable Voice Typing"}
        </button>
      </div>
      {isSpeaking && (
        <div className="text-center text-sm text-gray-700 animate-pulse mb-2">
          🎤 Listening...
        </div>
      )}
    </div>
  );
};

export default LiveRoom;