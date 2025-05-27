"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Mic, MicOff, Loader, X } from "lucide-react";

const VoiceToVoiceChat = ({ chatId, isVToVActive, setActive }) => {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

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

    recognition.onresult = async (event) => {
      const message = event.results[0][0].transcript;
      console.log("User said:", message);

      try {
        await axiosInstance.post(`/chats/${chatId}/history/`, {
          message,
          sender_type: "user",
        });

        const response = await axiosInstance.get(`/chats/${chatId}/history/`);
        const allMessages = response.data;
        const botMessage = allMessages[allMessages.length - 1];

        setMessages(allMessages);

        if (botMessage?.sender_type === "bot") {
          const utterance = new SpeechSynthesisUtterance(botMessage.message);
          utterance.lang = "en-US";

          utterance.onstart = () => setSpeaking(true);
          utterance.onend = () => setSpeaking(false);
          isVToVActive
            ? window.speechSynthesis.speak(utterance)
            : window.speechSynthesis.cancel(utterance);
        }
      } catch (err) {
        console.error("Chat error:", err);
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
