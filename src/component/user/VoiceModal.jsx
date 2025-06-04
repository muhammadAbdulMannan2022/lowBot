"use client";

import { useState, useEffect } from "react";
import { Mic, X } from "lucide-react";

export default function VoiceInput({ setActive, setMessage }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
      setError("");
    };

    recognitionInstance.onerror = (event) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, []);

  const startListening = () => {
    if (!recognition || !isSupported) return;
    setTranscript("");
    setError("");
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setError("Failed to start listening. Please try again.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setMessage(transcript);
    setActive(false);
    if (!recognition) return;
    try {
      recognition.stop();
      setIsListening(false);
    } catch {
      setError("Failed to stop listening. Please try again.");
    }
  };

  useEffect(() => {
    if (recognition && isSupported) {
      startListening();
    }
  }, [recognition, isSupported]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center justify-center min-h-[320px]">
        {!isSupported ? (
          <p className="text-red-600 text-center text-sm">
            Speech Recognition is not supported in this browser. Please use
            Chrome or Edge.
          </p>
        ) : (
          <>
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                isListening
                  ? "animate-pulse border-4 border-blue-500"
                  : "border border-gray-300"
              } bg-gray-100`}
            >
              <Mic className="text-gray-400" size={28} />
            </div>

            <p className="text-gray-500 text-sm mb-4">
              {isListening ? "Listening..." : "Tap the mic to start speaking"}
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <div className="flex space-x-4">
              <button
                onClick={startListening}
                disabled={isListening || !isSupported}
                className={`p-4 rounded-full transition-all ${
                  isListening || !isSupported
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                aria-label="Start voice input"
              >
                <Mic size={28} />
              </button>

              <button
                onClick={stopListening}
                disabled={!isListening}
                className={`p-4 rounded-full transition-all ${
                  !isListening
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                aria-label="Stop voice input"
              >
                Stop
              </button>
            </div>
          </>
        )}
      </div>

      {transcript && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow w-full max-w-md">
          <h3 className="text-sm font-semibold mb-2 text-gray-600">
            Transcript:
          </h3>
          <p className="text-gray-800">{transcript}</p>
        </div>
      )}
    </div>
  );
}
