"use client";

import { useState, useEffect, useRef } from "react";
import { X, Mic, Volume2 } from "lucide-react";

const WS_URL = `wss://devidcyrus.duckdns.org/ws/api/v1/chat/ai_voice_chat/?Authorization=Bearer ${
  typeof window !== "undefined" ? localStorage.getItem("token") : ""
}`;

// Talking Animation Component
const Talking = () => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <div
        className="w-3 h-10 bg-white/90 rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-3 h-16 bg-white/95 rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-3 h-8 bg-white/90 rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "300ms" }}
      />
      <div
        className="w-3 h-14 bg-white/95 rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "450ms" }}
      />
      <div
        className="w-3 h-12 bg-white/90 rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "600ms" }}
      />
      <div
        className="w-3 h-6 bg-white/85 rounded-full animate-bounce shadow-lg"
        style={{ animationDelay: "750ms" }}
      />
    </div>
  );
};

export default function VoiceChatPage({ isVToVActive, setActive }) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if we've started the conversation
  const ws = useRef(null);
  const recognitionRef = useRef(null);
  const chatId = "voice_chat_session";

  const startVoiceRecognition = () => {
    // Don't start if already listening or speaking
    if (listening || speaking) return;

    window.speechSynthesis.cancel();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onerror = (event) => {
      setListening(false);
      // Auto-retry on error (except abort)
      if (event.error !== "aborted" && isVToVActive && !speaking) {
        setTimeout(() => startVoiceRecognition(), 1000);
      }
    };
    recognition.onend = () => setListening(false);

    recognition.onspeechstart = () => {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    };

    recognition.onresult = (event) => {
      const message = event.results[0][0].transcript;
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            chat_id: chatId,
            sender_type: "user",
            message,
          })
        );
      }
      recognition.stop();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleManualStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setTimeout(() => {
      startVoiceRecognition();
    }, 100);
  };

  // WebSocket setup with improved initial handling
  useEffect(() => {
    if (!isVToVActive) return;
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "subscribe", chat_id: chatId }));
      setIsReady(true);
      // Don't auto-start listening here - wait for first message or timeout
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setHasStarted(true); // Mark that conversation has started

        const utterance = new window.SpeechSynthesisUtterance(data.message);
        utterance.lang = "en-US";
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
          setSpeaking(false);
          // Always restart listening after AI finishes speaking
          setTimeout(() => {
            if (isVToVActive) {
              startVoiceRecognition();
            }
          }, 200);
        };

        // Cancel any ongoing recognition before speaking
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        setListening(false);

        if (isVToVActive) {
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = () => {
      window.speechSynthesis.cancel();
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (ws.current) {
        ws.current.close();
      }
      window.speechSynthesis.cancel();
    };
  }, [chatId, isVToVActive]);

  // Auto-start listening logic - improved to handle initial state
  useEffect(() => {
    if (!isVToVActive || !isReady) return;

    // If we haven't started conversation yet, wait a bit then start listening
    if (!hasStarted && !listening && !speaking) {
      const timer = setTimeout(() => {
        startVoiceRecognition();
      }, 1000); // Give time for welcome message
      return () => clearTimeout(timer);
    }

    // For ongoing conversation, restart listening if not speaking
    if (hasStarted && !speaking && !listening) {
      const timer = setTimeout(() => {
        startVoiceRecognition();
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isVToVActive, isReady, hasStarted, speaking, listening]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-purple-400/10 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
      </div>

      {/* Enhanced Close Button */}
      <button
        onClick={() => setActive(false)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group z-10"
        aria-label="Close voice chat"
      >
        <X className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors" />
      </button>

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center justify-center space-y-8 p-8 w-full max-w-lg mx-auto">
        {/* Status Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            AI Voice Assistant
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">
            {!isReady
              ? "Connecting..."
              : speaking
              ? "AI is responding..."
              : listening
              ? "Listening to you..."
              : hasStarted
              ? "Ready for your response..."
              : "Initializing..."}
          </p>
        </div>

        {/* Enhanced Main Voice Interface */}
        <div className="relative">
          {/* Multiple Outer Ring Animations */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              listening
                ? "bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse scale-125"
                : speaking
                ? "bg-gradient-to-r from-green-400 to-emerald-600 animate-pulse scale-125"
                : "bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse scale-110"
            }`}
            style={{
              width: "300px",
              height: "300px",
              filter: "blur(15px)",
              opacity: listening || speaking ? 0.8 : 0.4,
            }}
          />

          {/* Secondary Ring */}
          <div
            className={`absolute inset-4 rounded-full transition-all duration-300 ${
              listening
                ? "bg-blue-500/30 animate-ping"
                : speaking
                ? "bg-green-500/30 animate-ping"
                : "bg-purple-500/20"
            }`}
          />

          {/* Main Interactive Circle */}
          <div
            className={`relative flex flex-col items-center justify-center w-72 h-72 rounded-full transition-all duration-500 cursor-pointer group ${
              listening
                ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl shadow-blue-500/50 scale-110"
                : speaking
                ? "bg-gradient-to-br from-green-500 to-emerald-700 shadow-2xl shadow-green-500/50 scale-110"
                : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl shadow-purple-500/40"
            } border-4 border-white/20 backdrop-blur-sm`}
            onClick={() => {
              if (speaking) {
                handleManualStop();
              } else if (!listening && isReady) {
                startVoiceRecognition();
              }
            }}
          >
            {/* Inner Content */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {!isReady ? (
                // Loading state while connecting
                <>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-white/60 border-t-white rounded-full animate-spin" />
                    </div>
                  </div>
                  <div className="text-white font-bold text-2xl drop-shadow-md">
                    Connecting...
                  </div>
                </>
              ) : (
                // Always show either listening or speaking
                <>
                  <div className="relative">
                    <Talking />
                    {/* Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {listening ? (
                        <Mic className="w-14 h-14 text-white/90 drop-shadow-lg" />
                      ) : (
                        <Volume2 className="w-14 h-14 text-white/90 drop-shadow-lg" />
                      )}
                    </div>
                  </div>
                  <div className="text-white font-bold text-2xl drop-shadow-md">
                    {speaking ? "Speaking" : "Listening"}
                  </div>
                </>
              )}
            </div>

            {/* Enhanced Ripple Effects */}
            {(listening || speaking || !isReady) && (
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                <div
                  className="absolute inset-3 rounded-full bg-white/15 animate-ping"
                  style={{ animationDelay: "200ms" }}
                />
                <div
                  className="absolute inset-6 rounded-full bg-white/10 animate-ping"
                  style={{ animationDelay: "400ms" }}
                />
                <div
                  className="absolute inset-9 rounded-full bg-white/5 animate-ping"
                  style={{ animationDelay: "600ms" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Status Indicators */}
        <div className="flex space-x-6">
          <div
            className={`px-8 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
              listening
                ? "bg-blue-100/80 dark:bg-blue-900/40 border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/20"
                : "bg-white/60 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Mic className="w-6 h-6" />
              <span className="font-bold text-lg">Microphone</span>
              <div
                className={`w-3 h-3 rounded-full ${
                  listening ? "bg-blue-500 animate-pulse" : "bg-slate-400"
                }`}
              />
            </div>
          </div>

          <div
            className={`px-8 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
              speaking
                ? "bg-green-100/80 dark:bg-green-900/40 border-green-400 dark:border-green-500 text-green-700 dark:text-green-300 shadow-lg shadow-green-500/20"
                : "bg-white/60 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Volume2 className="w-6 h-6" />
              <span className="font-bold text-lg">Speaker</span>
              <div
                className={`w-3 h-3 rounded-full ${
                  speaking ? "bg-green-500 animate-pulse" : "bg-slate-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Instructions */}
        <div className="text-center max-w-md">
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
            {!isReady
              ? "Setting up your voice assistant..."
              : speaking
              ? "Tap the circle to interrupt and start speaking"
              : listening
              ? "Speak clearly into your microphone"
              : hasStarted
              ? "Tap to speak or wait for auto-listening"
              : "Waiting for AI welcome message..."}
          </p>
        </div>
      </div>
    </div>
  );
}
