import '../App.css';

import QuizReward from './QuizReward';

const FEEDBACK_MESSAGES = {
  idle: 'Say the animal name!',
  correct: (transcript) => `[${transcript}] is Correct, congratulations!`,
  wrong: (transcript) => `[${transcript}] is Wrongly DETECTED, try again!`,
};

function getFeedbackMessage(
  quizStatus,
  feedback,
  transcript,
  totalRounds,
  totalLoops
) {
  if (quizStatus === 'idle') {
    return 'Press Start quiz to begin!';
  }

  if (quizStatus === 'reward') {
    return 'Great job! Enjoy your reward.';
  }

  if (quizStatus === 'all_complete') {
    return `You finished all ${totalLoops} loops! Great job!`;
  }

  if (feedback === 'idle') {
    return FEEDBACK_MESSAGES.idle;
  }

  const messageBuilder = FEEDBACK_MESSAGES[feedback];
  return messageBuilder(transcript);
}

function VoiceQuizView({
  quizStatus,
  currentLoop,
  totalLoops,
  currentRound,
  totalRounds,
  isListening,
  transcript,
  currentAnimal,
  startQuiz,
  feedback,
  currentReward,
  advanceAfterReward,
  isConfigValid,
}) {
  const showStartButton =
    isConfigValid && (quizStatus === 'idle' || quizStatus === 'all_complete');
  const isReward = quizStatus === 'reward';
  const isInProgress = quizStatus === 'in_progress';

  return (
    <div className="voice-quiz">
      <h1>Voice Recognition Demo</h1>

      {!isConfigValid && (
        <p className="quiz-config-error">
          Quiz config error: add at least one reward to REWARDS.
        </p>
      )}

      {isInProgress && (
        <p className="quiz-progress">
          Loop {currentLoop} of {totalLoops}
        </p>
      )}

      {isInProgress && (
        <p className="quiz-progress">
          Round {currentRound} of {totalRounds}
        </p>
      )}

      {isInProgress && currentAnimal && (
        <img
          src={currentAnimal.imageUrl}
          alt={currentAnimal.name}
          width="350"
          className="animal-image"
        />
      )}

      {isInProgress && (
        <p className="listening-status">
          {isListening ? 'Listening...' : 'Processing...'}
        </p>
      )}

      {!isReward && (
        <h2>Heard: {transcript || '...'}</h2>
      )}

      <h1>
        {getFeedbackMessage(
          quizStatus,
          feedback,
          transcript,
          totalRounds,
          totalLoops
        )}
      </h1>

      {isReward && (
        <QuizReward reward={currentReward} onComplete={advanceAfterReward} />
      )}

      {showStartButton && (
        <button className="listen-button" onClick={startQuiz}>
          Start quiz
        </button>
      )}
    </div>
  );
}

export default VoiceQuizView;
