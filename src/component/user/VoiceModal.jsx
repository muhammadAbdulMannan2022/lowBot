"use client";

import { useState, useEffect } from "react";
import { Mic, X } from "lucide-react";

// Define SpeechRecognition type

export default function VoiceInput({ setActive }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if running in browser environment
    if (typeof window === "undefined") return;

    // Check for SpeechRecognition API support
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError("Speech Recognition API is not supported in this browser.");
      return;
    }

    // Initialize SpeechRecognition
    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US"; // Set language (optional)

    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
      setError("");
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    // Cleanup on unmount
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      setTranscript("");
      setError("");
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    if (!recognition || !isSupported) return;
    setTranscript("");
    setError("");
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      setError("Failed to start listening. Please try again.");
      setIsListening(false);
    }
  };

  // start listening on component mount
  useEffect(() => {
    if (isSupported) {
      startListening();
    }
  }, [isSupported]);
  const stopListening = () => {
    setActive(false);
    if (!recognition) return;
    try {
      recognition.stop();
      setIsListening(false);
    } catch (err) {
      setError("Failed to stop listening. Please try again.");
    }
  };

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      {/* Main Voice Input Area */}
      <div className="bg-gray-200 p-10 rounded-lg w-full max-w-md flex flex-col items-center justify-center min-h-[300px]">
        {!isSupported ? (
          <p className="text-red-500 text-sm text-center">
            Speech Recognition is not supported in this browser. Please use a
            supported browser like Chrome or Edge.
          </p>
        ) : (
          <>
            {/* Visual Feedback for Listening */}
            <div
              className={
                ("w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 transition-all",
                isListening ? "animate-pulse border-4 border-blue-500" : "")
              }
            >
              {transcript ? (
                <span className="text-gray-400 text-xs overflow-hidden max-w-[80px] text-center">
                  {transcript.substring(0, 20)}
                  {transcript.length > 20 ? "..." : ""}
                </span>
              ) : (
                <Mic className="text-gray-400" size={24} />
              )}
            </div>

            {/* Status Text */}
            <p className="text-gray-400 text-sm mb-6">
              {isListening ? "Listening..." : "Start speaking to get started"}
            </p>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Control Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={startListening}
                disabled={isListening || !isSupported}
                className={
                  ("rounded-full text-white focus:outline-none transition-colors",
                  isListening || !isSupported
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600")
                }
                aria-label="Start voice input"
              >
                <Mic size={30} color="white" />
              </button>

              <button
                onClick={stopListening}
                disabled={!isListening}
                className={
                  ("p-3 rounded-full text-white focus:outline-none transition-colors",
                  !isListening
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-400 hover:bg-gray-500")
                }
                aria-label="Stop voice input"
              >
                <X size={30} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div
          className="mt-6 p-4 bg-white rounded-lg shadow-sm w-full max-w-md"
          aria-live="polite"
        >
          <h3 className="text-sm font-medium mb-2">Transcript:</h3>
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
}
