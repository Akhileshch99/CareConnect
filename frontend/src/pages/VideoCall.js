import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function VideoCall() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = searchParams.get("appointmentId");

  const [stream, setStream] = useState(null);
  const [callStarted, setCallStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const myVideo = useRef();
  const peerVideo = useRef();
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const PeerRef = useRef(null);
  const durationInterval = useRef(null);

  useEffect(() => {
    // Get local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
        setConnectionStatus("ready");
      })
      .catch(err => {
        console.error("Error accessing media devices:", err);
        setConnectionStatus("error");
      });

    // Join room based on appointment ID
    const roomId = appointmentId || "room123";

    const setupNetworking = async () => {
      try {
        const [{ default: SimplePeer }, { io }] = await Promise.all([
          import("simple-peer"),
          import("socket.io-client")
        ]);

        PeerRef.current = SimplePeer;
        socketRef.current = io("http://localhost:5000");
        const socket = socketRef.current;

        socket.emit("join-room", roomId);

        socket.on("offer", (offer) => {
          setConnectionStatus("connecting");
          const peer = new SimplePeer({ initiator: false, trickle: false, stream });
          peer.on("signal", (data) => {
            socket.emit("answer", { roomId, answer: data });
          });
          peer.on("stream", (remoteStream) => {
            if (peerVideo.current) {
              peerVideo.current.srcObject = remoteStream;
            }
            setConnectionStatus("connected");
            startCallTimer();
          });
          peer.on("error", (err) => {
            console.error("Peer error:", err);
            setConnectionStatus("error");
          });
          peer.signal(offer);
          peerRef.current = peer;
        });

        socket.on("answer", (answer) => {
          if (peerRef.current) {
            peerRef.current.signal(answer);
            setConnectionStatus("connected");
            startCallTimer();
          }
        });

        socket.on("candidate", (candidate) => {
          if (peerRef.current) {
            peerRef.current.signal(candidate);
          }
        });
      } catch (err) {
        console.error("Error loading call dependencies:", err);
        setConnectionStatus("error");
      }
    };

    setupNetworking();

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const socket = socketRef.current;
      if (socket) {
        socket.off("offer");
        socket.off("answer");
        socket.off("candidate");
        socket.disconnect();
      }
    };
  }, [stream, appointmentId]);

  const startCallTimer = () => {
    durationInterval.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    if (!stream) return;

    setCallStarted(true);
    setConnectionStatus("calling");
    const roomId = appointmentId || "room123";

    const SimplePeer = PeerRef.current;
    const socket = socketRef.current;
    if (!SimplePeer || !socket) {
      console.error("Call dependencies are not ready yet.");
      return;
    }

    const peer = new SimplePeer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("offer", { roomId, offer: data });
    });
    peer.on("stream", (remoteStream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = remoteStream;
      }
      setConnectionStatus("connected");
      startCallTimer();
    });
    peer.on("error", (err) => {
      console.error("Peer error:", err);
      setConnectionStatus("error");
    });
    peerRef.current = peer;
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    navigate("/patient-dashboard");
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "text-green-600";
      case "calling": case "connecting": return "text-yellow-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "ready": return "Ready to call";
      case "calling": return "Calling...";
      case "connecting": return "Connecting...";
      case "connected": return "Connected";
      case "error": return "Connection error";
      default: return "Initializing...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/patient-dashboard")}
            className="text-white hover:text-gray-300 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Video Consultation</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${getStatusColor()}`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected" ? "bg-green-500" :
              connectionStatus === "calling" || connectionStatus === "connecting" ? "bg-yellow-500" :
              connectionStatus === "error" ? "bg-red-500" : "bg-gray-500"
            }`}></div>
            <span className="text-sm">{getStatusText()}</span>
          </div>
          {connectionStatus === "connected" && (
            <div className="text-green-400 font-mono text-lg">
              {formatDuration(callDuration)}
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl aspect-video bg-gray-800 rounded-xl overflow-hidden">
          {/* Main Video (Peer) */}
          <video
            ref={peerVideo}
            autoPlay
            className="w-full h-full object-cover"
            style={{ display: connectionStatus === "connected" ? "block" : "none" }}
          />

          {/* Waiting Screen */}
          {connectionStatus !== "connected" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📹</div>
                <h3 className="text-xl font-semibold mb-2">Video Consultation</h3>
                <p className="text-gray-300">
                  {connectionStatus === "ready" ? "Click 'Start Call' to begin" :
                   connectionStatus === "calling" ? "Waiting for doctor to answer..." :
                   connectionStatus === "connecting" ? "Establishing connection..." :
                   "Preparing video call..."}
                </p>
              </div>
            </div>
          )}

          {/* My Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={myVideo}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                <span className="text-2xl">📷</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6">
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-4">
          {!callStarted ? (
            <button
              onClick={startCall}
              disabled={connectionStatus === "error"}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-200 flex items-center gap-2"
            >
              📞 Start Call
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`px-6 py-4 rounded-full font-semibold text-lg transition duration-200 flex items-center gap-2 ${
                  isMuted
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                {isMuted ? "🔇" : "🎤"} {isMuted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={toggleVideo}
                className={`px-6 py-4 rounded-full font-semibold text-lg transition duration-200 flex items-center gap-2 ${
                  isVideoOff
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                {isVideoOff ? "📷" : "📹"} {isVideoOff ? "Turn On" : "Turn Off"}
              </button>

              <button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-200 flex items-center gap-2"
              >
                📞 End Call
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;