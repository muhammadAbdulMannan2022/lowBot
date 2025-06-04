import React, { useState, useEffect, useRef } from "react";
import { MicOff, X, Square } from "lucide-react";
import Talking from "./Talking";

const WS_URL = `wss://devidcyrus.duckdns.org/ws/api/v1/chat/ai_voice_chat/?Authorization=Beare ${localStorage.getItem(
  "token"
)}`;

const VoiceToVoiceChat = ({ chatId, isVToVActive, setActive }) => {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const ws = useRef(null);
  const recognitionRef = useRef(null);

  // Helper to start recognition
  const startVoiceRecognition = () => {
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
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    // Interrupt bot speech as soon as user starts talking
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
      // After sending, wait for bot to speak, then restart recognition in onend of speech
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Manual stop handler
  const handleManualStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setTimeout(() => {
      startVoiceRecognition();
    }, 100);
  };

  // WebSocket setup
  useEffect(() => {
    if (!isVToVActive) return;
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "subscribe", chat_id: chatId }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        const utterance = new window.SpeechSynthesisUtterance(data.message);
        utterance.lang = "en-US";
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
          setSpeaking(false);
          // After bot finishes, start listening again
          setTimeout(() => {
            if (isVToVActive) startVoiceRecognition();
          }, 200);
        };
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
      ws.current && ws.current.close();
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line
  }, [chatId, isVToVActive]);

  // Start listening automatically when active, and keep listening unless speaking
  useEffect(() => {
    if (isVToVActive && !speaking) {
      startVoiceRecognition();
    }
    return () => {
      recognitionRef.current && recognitionRef.current.abort();
    };
    // eslint-disable-next-line
  }, [isVToVActive, speaking]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors w-full h-full">
      <button
        onClick={() => setActive(false)}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        <X className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
      {/* Manual stop/interruption button */}
      {/* {speaking && (
        <button
          onClick={handleManualStop}
          className="absolute top-4 left-4 p-2 rounded-full bg-red-200 dark:bg-red-800 hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
          title="Interrupt and start listening"
        >
          <Square className="w-6 h-6 text-red-700 dark:text-red-300" />
        </button>
      )} */}
      <div className="p-4 sm:p-8 w-full max-w-sm mx-auto text-center space-y-6">
        <div
          className={`relative flex flex-col items-center justify-center w-32 h-32 mx-auto rounded-full transition-all
            ${
              listening
                ? "bg-blue-100 animate-pulse"
                : "bg-green-100 hover:bg-green-200 hover:cursor-pointer"
            }
            text-white shadow-lg`}
          onClick={() => speaking && handleManualStop()}
        >
          {/* Show Talking animation for both states */}
          {listening || speaking ? (
            <>
              <Talking />
              <div
                className={`mt-2 text-base font-semibold ${
                  speaking
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-green-700 dark:text-green-300"
                }`}
              >
                {speaking ? "Speaking..." : "Listening..."}
              </div>
            </>
          ) : (
            <>
              <MicOff className="w-10 h-10 text-gray-400" />
              <div className="mt-2 text-base text-gray-500">Waiting...</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceToVoiceChat;
