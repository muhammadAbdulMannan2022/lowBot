import { useState, useEffect, useRef } from "react";
import {
  X,
  Mic,
  Volume2,
  Pause,
  Play,
  VolumeX,
  Volume1,
  MicOff,
} from "lucide-react";

// CRITICAL: Detect if Speech Recognition is supported. This will be FALSE on iPhone.
const IS_SPEECH_RECOGNITION_SUPPORTED =
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

const WS_URL = `wss://leapapp-d8gtazf2e9aygcc6.canadacentral-01.azurewebsites.net/ws/api/v1/chat/ai_voice_chat/?Authorization=Bearer ${
  typeof window !== "undefined" ? localStorage.getItem("token") : ""
}`;

export default function VoiceChatPage({ isVToVActive, setActive }) {
  // Session states to manage the "start" gate for iOS
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Your original states
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [micEnabled, setMicEnabled] = useState(IS_SPEECH_RECOGNITION_SUPPORTED);

  // Refs
  const ws = useRef(null);
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);
  const audioRef = useRef(null); // Will hold our single, reusable audio element
  const chatId = "voice_chat_session";

  // enc function (no changes)
  function enc(hex) {
    let binary = "";
    for (let i = 0; i < hex.length; i += 1) {
      binary += parseInt(hex[i], 16).toString(2).padStart(4, "0");
    }
    let base64 = "";
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8);
      base64 += String.fromCharCode(parseInt(byte, 2));
    }
    return atob(base64);
  }
  const encD = enc(import.meta.env.VITE_ELEVENLABS_API_KEY);

  // --- Cleaned Up Logic Functions ---

  const stopAllAudio = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // Clear src to stop buffering
    }
    speakingRef.current = false;
    setSpeaking(false);
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const startVoiceRecognition = () => {
    // Guard against starting in invalid states
    if (
      !IS_SPEECH_RECOGNITION_SUPPORTED ||
      listening ||
      speakingRef.current ||
      isPaused ||
      !micEnabled ||
      !isReady
    ) {
      return;
    }
    stopAllAudio();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event) =>
      console.error("Speech Recognition Error:", event.error);
    recognition.onresult = (event) => {
      const message = event.results[0][0].transcript;
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({ chat_id: chatId, sender_type: "user", message })
        );
      }
    };
    recognition.start();
  };

  // --- Session Handler & Lifecycle ---

  const handleStartSession = async () => {
    if (sessionStarted || isConnecting) return;
    setIsConnecting(true);

    // For iOS: create and "unlock" a single audio element with a user gesture.
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      // This is the "unlock" trick.
      audioRef.current.play().catch(() => {});
      audioRef.current.pause();
    }

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "subscribe", chat_id: chatId }));
      setIsConnecting(false);
      setIsReady(true);
      setSessionStarted(true);
      setTimeout(() => startVoiceRecognition(), 200); // Start listening after connection
    };

    ws.current.onmessage = async (event) => {
      if (isPaused) return;
      const data = JSON.parse(event.data);
      if (data.message) {
        stopRecognition();
        stopAllAudio();
        try {
          const voiceId = import.meta.env.VITE_VOICE_ID;
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "xi-api-key": encD,
              },
              body: JSON.stringify({
                text: data.message,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.5,
                },
              }),
            }
          );
          if (!response.ok) throw new Error(`API Error`);
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);

          // REUSE the unlocked audio element
          const audio = audioRef.current;
          audio.src = audioUrl;

          audio.onplay = () => {
            speakingRef.current = true;
            setSpeaking(true);
          };
          audio.onended = () => {
            speakingRef.current = false;
            setSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            if (isVToVActive && !isPaused && micEnabled) {
              startVoiceRecognition(); // Listen again after AI finishes
            }
          };
          audio.onerror = (error) => {
            console.error("Error playing audio:", error);
            speakingRef.current = false;
            setSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            if (isVToVActive && !isPaused && micEnabled) {
              startVoiceRecognition();
            }
          };
          await audio.play(); // This now works on iOS
        } catch (err) {
          console.error("TTS fetch/play error:", err);
          setSpeaking(false);
        }
      }
    };
    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnecting(false);
      setIsReady(false);
    };
    ws.current.onclose = () => setIsReady(false);
  };

  const handleManualInterrupt = () => {
    stopAllAudio();
    startVoiceRecognition();
  };

  // Master useEffect for setup and cleanup
  useEffect(() => {
    // This return function is the cleanup, called when the component unmounts.
    return () => {
      stopAllAudio();
      stopRecognition();
      if (ws.current) {
        ws.current.onclose = null; // prevent any reconnect logic
        ws.current.close();
        ws.current = null;
      }
    };
  }, []); // Empty array ensures this runs only on mount and unmount

  // Effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Helper for displaying status text
  const getStatusText = () => {
    if (!sessionStarted)
      return isConnecting ? "Connecting..." : "Tap icon to start";
    if (isPaused) return "Chat Paused";
    if (speaking) return "AI is speaking...";
    if (listening) return "Listening...";
    if (!IS_SPEECH_RECOGNITION_SUPPORTED) return "Ready for AI to speak";
    return "Ready to chat...";
  };

  const Talking = () => (
    <div className="flex items-center justify-center space-x-1.5">
      {[10, 16, 8, 14, 12, 6].map((height, i) => (
        <div
          key={i}
          className="w-3.5 bg-gradient-to-t from-white/90 to-white rounded-full animate-bounce shadow-lg"
          style={{
            height: `${height * 0.25}rem`,
            animationDelay: `${i * 150}ms`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-800 transition-all duration-700 overflow-hidden">
      <div className="absolute inset-0 opacity-15 dark:opacity-25">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/30 via-purple-500/20 to-transparent animate-pulse"></div>
        <div
          className="absolute top-1/3 left-1/5 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "500ms" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
      </div>

      <button
        onClick={() => setActive(false)}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/30 hover:bg-white dark:hover:bg-slate-700 transform hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg z-20"
        aria-label="Close voice chat"
      >
        <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      </button>

      <div className="relative flex flex-col items-center justify-center space-y-6 p-6 w-full max-w-md sm:max-w-lg mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight bg-clip-text">
            VoiceSync AI
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-medium">
            {getStatusText()}
          </p>
        </div>

        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              listening
                ? "bg-gradient-to-r from-blue-500 to-blue-700 animate-pulse scale-125"
                : speaking
                ? "bg-gradient-to-r from-emerald-500 to-green-700 animate-pulse scale-125"
                : "bg-gradient-to-r from-purple-500 to-pink-600 animate-pulse scale-110"
            }`}
            style={{
              width: "280px",
              height: "280px",
              filter: "blur(20px)",
              opacity: 0.7,
            }}
          ></div>
          <div
            className={`absolute inset-4 rounded-full transition-all duration-400 ${
              listening
                ? "bg-blue-600/25 animate-ping"
                : speaking
                ? "bg-green-600/25 animate-ping"
                : "bg-purple-600/20"
            }`}
          ></div>

          <div
            className={`relative flex flex-col items-center justify-center w-64 h-64 rounded-full transition-all duration-500 cursor-pointer group ${
              listening
                ? "bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl shadow-blue-600/50 scale-105"
                : speaking
                ? "bg-gradient-to-br from-emerald-600 to-green-800 shadow-2xl shadow-green-600/50 scale-105"
                : "bg-gradient-to-br from-purple-600 to-pink-700 shadow-xl shadow-purple-600/40"
            } border-4 border-white/20 backdrop-blur-lg hover:scale-110`}
            onClick={() => {
              if (!sessionStarted) {
                handleStartSession();
                return;
              }
              if (isPaused) return;
              if (speaking) {
                handleManualInterrupt();
              } else if (!listening) {
                startVoiceRecognition();
              }
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              {!sessionStarted ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center">
                    {isConnecting ? (
                      <div className="w-6 h-6 border-2 border-white/70 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </div>
                  <div className="text-white text-lg font-semibold drop-shadow-md">
                    {isConnecting ? "Connecting" : "Start Chat"}
                  </div>
                </>
              ) : (
                <>
                  <div className="relative scale-110">
                    {speaking ? (
                      <Talking />
                    ) : (
                      <Mic className="w-16 h-16 text-white/90" />
                    )}
                  </div>
                  <div className="text-white text-xl font-bold drop-shadow-md">
                    {isPaused
                      ? "Paused"
                      : speaking
                      ? "Speaking"
                      : listening
                      ? "Listening"
                      : "Ready"}
                  </div>
                </>
              )}
            </div>
            {(listening || speaking) && sessionStarted && (
              <div className="absolute inset-0 rounded-full">
                {[0, 3, 6, 9].map((inset, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full bg-white/15 animate-ping"
                    style={{
                      inset: `${inset}px`,
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {sessionStarted && (
          <div className="flex flex-col items-center space-y-4 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg animate-slide-up">
            <div className="flex space-x-4">
              <div
                className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                  listening && !isPaused
                    ? "bg-blue-100/90 dark:bg-blue-900/50 border-blue-400 text-blue-700 dark:text-blue-300 shadow-md"
                    : "bg-white/50 dark:bg-slate-700/50 border-slate-300 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-semibold">Mic</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      listening && !isPaused
                        ? "bg-blue-500 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                  speaking && !isPaused
                    ? "bg-green-100/90 dark:bg-green-900/50 border-green-400 text-green-700 dark:text-green-300 shadow-md"
                    : "bg-white/50 dark:bg-slate-700/50 border-slate-300 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Speaker</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      speaking && !isPaused
                        ? "bg-green-500 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
              <button
                disabled={!IS_SPEECH_RECOGNITION_SUPPORTED}
                onClick={() => {
                  const nextMicState = !micEnabled;
                  setMicEnabled(nextMicState);
                  if (nextMicState) {
                    startVoiceRecognition();
                  } else {
                    stopRecognition();
                  }
                }}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  micEnabled
                    ? "bg-blue-500 hover:bg-blue-600 shadow-md"
                    : "bg-red-500 hover:bg-red-600 shadow-md"
                } transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed`}
                aria-label={
                  !IS_SPEECH_RECOGNITION_SUPPORTED
                    ? "Microphone not supported"
                    : micEnabled
                    ? "Disable microphone"
                    : "Enable microphone"
                }
              >
                {micEnabled ? (
                  <Mic className="w-5 h-5 text-white" />
                ) : (
                  <MicOff className="w-5 h-5 text-white" />
                )}
              </button>
              <div className="flex items-center space-x-2 w-32">
                <Volume1 className="text-slate-600 dark:text-slate-300 w-4 h-4" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
                />
                <Volume2 className="text-slate-600 dark:text-slate-300 w-4 h-4" />
              </div>
              <button
                onClick={() => {
                  const nextPausedState = !isPaused;
                  setIsPaused(nextPausedState);
                  if (nextPausedState) {
                    stopAllAudio();
                    stopRecognition();
                  } else {
                    startVoiceRecognition();
                  }
                }}
                className={`p-2.5 rounded-full ${
                  isPaused
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "from-purple-500 to-purple-600 bg-gradient-to-r"
                } shadow-md transform hover:scale-105 transition-all duration-300`}
                aria-label={isPaused ? "Resume chat" : "Pause"}
              >
                {isPaused ? (
                  <Play className="w-5 h-5 text-white" />
                ) : (
                  <Pause className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        )}

        <div className="text-center max-w-md text-sm sm:text-base">
          <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed font-medium animate-fade-in">
            {!sessionStarted
              ? "Press the start button to begin your conversation with the AI."
              : isPaused
              ? "Chat is paused. Press play to resume."
              : speaking
              ? "Tap the icon to interrupt the AI and speak."
              : listening
              ? "Speak clearly into your microphone now."
              : "Ready for you to speak. Tap the icon or just start talking."}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.2s;
        }
        input[type="range"]:hover::-webkit-slider-thumb {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.2s;
        }
        input[type="range"]:hover::-moz-range-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

// its working but i can't see while data is loading so handle all the loading and other state so its works smoothly
