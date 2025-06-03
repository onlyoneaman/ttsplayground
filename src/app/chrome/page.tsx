"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

export default function TextToSpeech() {
  const [text, setText] = useState('Hello! This is a sample text to demonstrate text-to-speech functionality.');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Check if speech synthesis is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English voices)
      const englishVoice = availableVoices.find(voice => 
        voice.lang.startsWith('en-') && voice.default
      ) || availableVoices.find(voice => 
        voice.lang.startsWith('en-')
      ) || availableVoices[0];
      
      if (englishVoice) {
        setSelectedVoice(englishVoice.name);
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also listen for voices changed event (some browsers load voices asynchronously)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const speak = useCallback(() => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find and set the selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set speech parameters
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  }, [isSupported, text, voices, selectedVoice, rate, pitch, volume]);

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Auto-play when text changes (if enabled)
  useEffect(() => {
    if (autoPlay && text.trim() && !isPlaying) {
      const timeoutId = setTimeout(() => {
        speak();
      }, 500); // Small delay to avoid rapid firing
      
      return () => clearTimeout(timeoutId);
    }
  }, [text, selectedVoice, rate, pitch, volume, autoPlay, isPlaying, speak]);

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <Volume2 className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Speech Synthesis Not Supported
          </h2>
          <p className="text-gray-600">
            {`Your browser doesn't support the Web Speech API. Please try using Chrome, Edge, or Safari.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center gap-3">
              <Volume2 className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Text to Speech Converter</h1>
                <p className="text-blue-100">Convert your text to natural-sounding speech</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Text Input */}
            <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                Text to Convert
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter the text you want to convert to speech..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {text.length} characters
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={speak}
                disabled={!text.trim() || isPlaying}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Speak
              </button>

              {isPlaying && !isPaused && (
                <button
                  onClick={pause}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}

              {isPaused && (
                <button
                  onClick={resume}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              )}

              {isPlaying && (
                <button
                  onClick={stop}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto-play"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="auto-play" className="text-sm text-gray-700">
                  Auto-play when text changes
                </label>
              </div>
            </div>

            {/* Status */}
            {isPlaying && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  {isPaused ? '⏸️ Speech paused' : '🔊 Speaking...'}
                </p>
              </div>
            )}

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voice Selection */}
              <div>
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Voice ({voices.length} available)
                </label>
                <select
                  id="voice-select"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang}) {voice.default ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate Control */}
              <div>
                <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Speed: {rate}x
                </label>
                <input
                  id="rate-slider"
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow (0.1x)</span>
                  <span>Fast (2x)</span>
                </div>
              </div>

              {/* Pitch Control */}
              <div>
                <label htmlFor="pitch-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch: {pitch}x
                </label>
                <input
                  id="pitch-slider"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low (0x)</span>
                  <span>High (2x)</span>
                </div>
              </div>

              {/* Volume Control */}
              <div>
                <label htmlFor="volume-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  id="volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mute (0%)</span>
                  <span>Max (100%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-800 mb-2">How to use:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Enter or paste your text in the text area above</li>
            <li>• Choose your preferred voice and adjust settings</li>
            <li>{'• Click "Speak" to hear the text, or enable auto-play for immediate playback'}</li>
            <li>• Use pause/resume/stop controls to manage playback</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}