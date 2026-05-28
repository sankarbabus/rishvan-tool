import { useEffect, useRef, useState } from 'react';

import correctSound from '../audio/correctAnswer.mp3';
import wrongSound from '../audio/wrongAnswer.mp3';
import { pickRandomAnimal } from '../data/animals';
import { playSound } from '../utils/playSound';

function isCorrectAnswer(transcript, expectedName) {
  return transcript.trim().toLowerCase() === expectedName.toLowerCase();
}

export function useAnimalVoiceQuiz() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [feedback, setFeedback] = useState('idle');

  const currentAnimalNameRef = useRef('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      const animal = pickRandomAnimal();
      setCurrentAnimal(animal);
      currentAnimalNameRef.current = animal.name;
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const spokenText = result[0].transcript.trim();

      setTranscript(spokenText);

      if (result.isFinal) {
        const isCorrect = isCorrectAnswer(
          spokenText,
          currentAnimalNameRef.current
        );

        setFeedback(isCorrect ? 'correct' : 'wrong');
        playSound(isCorrect ? correctSound : wrongSound);
        recognition.stop();
      }
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setFeedback('idle');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return {
    isListening,
    transcript,
    currentAnimal,
    startListening,
    feedback,
  };
}
