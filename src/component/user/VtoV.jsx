"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X } from "lucide-react";

const WS_URL = `ws://192.168.10.124:3100/ws/api/v1/chat/ai_voice_chat/?Authorization=Beare ${localStorage.getItem(
  "token"
)}`;

const VoiceToVoiceChat = ({ chatId, isVToVActive, setActive }) => {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const ws = useRef(null);

  // Connect to WebSocket on mount
  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      ws.current.send(JSON.stringify({ type: "subscribe", chat_id: chatId }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Only speak the bot's response, do not show any messages
      if (data.message) {
        const utterance = new window.SpeechSynthesisUtterance(data.message);
        utterance.lang = "en-US";
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        if (isVToVActive) {
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.current && ws.current.close();
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line
  }, [chatId, isVToVActive]);

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
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const message = event.results[0][0].transcript;
      // Send message to WebSocket only, do not store or display
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            chat_id: chatId,
            sender_type: "user",
            message,
          })
        );
      }
    };

    recognition.start();
  };

  return (
    <div className="h-[80vh] w-[90%] flex items-center justify-center bg-white dark:bg-gray-900 transition-colors absolute top-0">
      <button
        onClick={() => setActive(false)}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        <X />
      </button>
      <div className="p-4 max-w-md mx-auto text-center space-y-6">
        <button
          onClick={startVoiceRecognition}
          className={`relative flex items-center justify-center w-20 h-20 mx-auto rounded-full transition-all
            ${
              listening
                ? "bg-blue-500 animate-pulse"
                : "bg-green-500 hover:bg-green-600"
            }
            text-white shadow-lg`}
        >
          {listening ? (
            <Mic className="w-8 h-8" />
          ) : (
            <MicOff className="w-8 h-8 animate-ping-slow" />
          )}

          {speaking && (
            <div className="absolute bottom-[-1.5rem] text-sm text-gray-800 dark:text-gray-300 animate-fade-in">
              Speaking...
            </div>
          )}
          {!speaking && listening && (
            <div className="absolute bottom-[-1.5rem] text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
              Listening...
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceToVoiceChat;
