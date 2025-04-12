import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VoiceChat: React.FC = () => {
  const localAudio = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<any>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if getUserMedia is available in the browser
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Request microphone access
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

          // Set the audio stream to play locally
          if (localAudio.current) {
            localAudio.current.srcObject = stream;
          }
          localStreamRef.current = stream;

          // Socket.io logic for communication (adjust as per your requirements)
          const socket = io('your-server-url'); // Replace with your actual server URL
          socket.emit('join', 'User');

          socket.on('offer', async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
            const pc = createPeerConnection(from); // Define this function
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('answer', { to: from, answer });
          });

          socket.on('answer', async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
            const pc = peersRef.current[from];
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
          });

          socket.on('ice-candidate', ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
            const pc = peersRef.current[from];
            if (pc && candidate) {
              pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
          });

          socket.on('user-joined', ({ id }: { id: string }) => {
            if (id === socket.id) return;
            const pc = createPeerConnection(id); // Define this function
            pc.createOffer().then((offer) => {
              pc.setLocalDescription(offer);
              socket.emit('offer', { to: id, offer });
            });
          });

        } else {
          // If getUserMedia is not supported, show an error message
          setErrorMessage("Your browser does not support microphone access. Please update your browser or use a different one.");
        }
      } catch (error) {
        // Handle errors (like permissions issues)
        console.error('Error accessing media devices:', error);
        setErrorMessage("Error accessing the microphone. Please ensure that you have granted permission.");
      }
    };

    init();

    // Cleanup the stream when the component unmounts
    return () => {
      if (localStreamRef.current) {
        const tracks = localStreamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Voice Chat</h2>
      {errorMessage ? (
        <div style={{ color: 'red' }}>{errorMessage}</div>
      ) : (
        <audio ref={localAudio} autoPlay muted />
      )}
      {/* Other UI components or messages */}
    </div>
  );
};

export default VoiceChat;
