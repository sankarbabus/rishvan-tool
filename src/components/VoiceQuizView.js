import '../App.css';

import QuizReward from './QuizReward';

const FEEDBACK_MESSAGES = {
  idle: 'Say the animal name!',
  correct: (transcript) => `[${transcript}] is Correct, congratulations!`,
  wrong: (transcript) => `[${transcript}] is Wrongly DETECTED, try again!`,
};

function getFeedbackMessage(quizStatus, feedback, transcript, totalRounds) {
  if (quizStatus === 'idle') {
    return 'Press Start quiz to begin!';
  }

  if (quizStatus === 'complete') {
    return `You finished all ${totalRounds} animals! Great job!`;
  }

  if (feedback === 'idle') {
    return FEEDBACK_MESSAGES.idle;
  }

  const messageBuilder = FEEDBACK_MESSAGES[feedback];
  return messageBuilder(transcript);
}

function VoiceQuizView({
  quizStatus,
  currentRound,
  totalRounds,
  isListening,
  transcript,
  currentAnimal,
  startQuiz,
  feedback,
}) {
  const showStartButton = quizStatus === 'idle' || quizStatus === 'complete';
  const isComplete = quizStatus === 'complete';
  const isInProgress = quizStatus === 'in_progress';

  return (
    <div className="voice-quiz">
      <h1>Voice Recognition Demo</h1>

      {isInProgress && (
        <p className="quiz-progress">
          Round {currentRound} of {totalRounds}
        </p>
      )}

      {isInProgress && currentAnimal && (
        <img
          src={currentAnimal.imageUrl}
          alt={currentAnimal.name}
          width="100"
          className="animal-image"
        />
      )}

      {isInProgress && (
        <p className="listening-status">
          {isListening ? 'Listening...' : 'Processing...'}
        </p>
      )}

      {!isComplete && (
        <h2>Heard: {transcript || '...'}</h2>
      )}

      <h1>{getFeedbackMessage(quizStatus, feedback, transcript, totalRounds)}</h1>

      {isComplete && <QuizReward />}

      {showStartButton && (
        <button className="listen-button" onClick={startQuiz}>
          Start quiz
        </button>
      )}
    </div>
  );
}

export default VoiceQuizView;
