import { useCallback, useEffect, useRef, useState } from 'react';

import correctSound from '../audio/correctAnswer.mp3';
import wrongSound from '../audio/wrongAnswer.mp3';
import {
  QUIZ_LOOP_COUNT,
  QUIZ_ROUND_COUNT,
  REWARDS,
} from '../config/quizConfig';
import { createQuizQueue } from '../data/animals';
import { playSound } from '../utils/playSound';

const RESTART_DELAY_MS = 800;

function isCorrectAnswer(transcript, expectedName) {
  return transcript.trim().toLowerCase() === expectedName.toLowerCase();
}

function pickRandomReward() {
  const index = Math.floor(Math.random() * REWARDS.length);
  return REWARDS[index];
}

export function isQuizConfigValid() {
  return REWARDS.length > 0;
}

export function useAnimalVoiceQuiz() {
  const [quizStatus, setQuizStatus] = useState('idle');
  const [loopIndex, setLoopIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [currentReward, setCurrentReward] = useState(null);
  const [feedback, setFeedback] = useState('idle');

  const quizQueueRef = useRef([]);
  const loopIndexRef = useRef(0);
  const roundIndexRef = useRef(0);
  const currentAnimalNameRef = useRef('');
  const quizStatusRef = useRef('idle');
  const shouldRestartRef = useRef(false);
  const isProcessingResultRef = useRef(false);
  const restartTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);

  const loadRound = useCallback((index) => {
    const animal = quizQueueRef.current[index];
    setCurrentAnimal(animal);
    currentAnimalNameRef.current = animal.name;
    setRoundIndex(index);
    roundIndexRef.current = index;
  }, []);

  useEffect(() => {
    quizStatusRef.current = quizStatus;
  }, [quizStatus]);

  useEffect(() => {
    loopIndexRef.current = loopIndex;
  }, [loopIndex]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      if (
        quizStatusRef.current !== 'in_progress' ||
        isProcessingResultRef.current
      ) {
        return;
      }

      const result = event.results[event.results.length - 1];
      const spokenText = result[0].transcript.trim();

      setTranscript(spokenText);

      if (!result.isFinal) {
        return;
      }

      isProcessingResultRef.current = true;

      const isCorrect = isCorrectAnswer(
        spokenText,
        currentAnimalNameRef.current
      );

      if (isCorrect) {
        setFeedback('correct');
        playSound(correctSound);

        const nextRoundIndex = roundIndexRef.current + 1;

        if (nextRoundIndex < quizQueueRef.current.length) {
          loadRound(nextRoundIndex);
          shouldRestartRef.current = true;
        } else {
          setCurrentReward(pickRandomReward());
          quizStatusRef.current = 'reward';
          setQuizStatus('reward');
        }
      } else {
        setFeedback('wrong');
        playSound(wrongSound);
        shouldRestartRef.current = true;
      }

      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      isProcessingResultRef.current = false;

      if (!shouldRestartRef.current || quizStatusRef.current !== 'in_progress') {
        shouldRestartRef.current = false;
        return;
      }

      shouldRestartRef.current = false;

      restartTimeoutRef.current = setTimeout(() => {
        if (quizStatusRef.current === 'in_progress' && recognitionRef.current) {
          setTranscript('');
          setFeedback('idle');
          recognitionRef.current.start();
        }
      }, RESTART_DELAY_MS);
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      recognition.stop();
    };
  }, [loadRound]);

  const startNextLoop = useCallback(() => {
    quizQueueRef.current = createQuizQueue(QUIZ_ROUND_COUNT);
    shouldRestartRef.current = false;
    isProcessingResultRef.current = false;

    setTranscript('');
    setFeedback('idle');
    loadRound(0);

    quizStatusRef.current = 'in_progress';
    setQuizStatus('in_progress');
    recognitionRef.current.start();
  }, [loadRound]);

  const advanceAfterReward = useCallback(() => {
    if (quizStatusRef.current !== 'reward') {
      return;
    }

    const nextLoopIndex = loopIndexRef.current + 1;

    if (nextLoopIndex < QUIZ_LOOP_COUNT) {
      loopIndexRef.current = nextLoopIndex;
      setLoopIndex(nextLoopIndex);
      startNextLoop();
      return;
    }

    quizStatusRef.current = 'all_complete';
    setQuizStatus('all_complete');
  }, [startNextLoop]);

  const startQuiz = useCallback(() => {
    if (
      !recognitionRef.current ||
      quizStatusRef.current === 'in_progress' ||
      quizStatusRef.current === 'reward' ||
      !isQuizConfigValid()
    ) {
      return;
    }

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    loopIndexRef.current = 0;
    setLoopIndex(0);
    setCurrentReward(null);
    startNextLoop();
  }, [startNextLoop]);

  return {
    quizStatus,
    currentLoop: loopIndex + 1,
    totalLoops: QUIZ_LOOP_COUNT,
    currentRound: roundIndex + 1,
    totalRounds: QUIZ_ROUND_COUNT,
    isListening,
    transcript,
    currentAnimal,
    startQuiz,
    feedback,
    currentReward,
    advanceAfterReward,
    isConfigValid: isQuizConfigValid(),
  };
}
