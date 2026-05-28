import '../App.css';

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

  return (
    <div className="voice-quiz">
      <h1>Voice Recognition Demo</h1>

      {quizStatus === 'in_progress' && (
        <p className="quiz-progress">
          Round {currentRound} of {totalRounds}
        </p>
      )}

      {currentAnimal && (
        <img
          src={currentAnimal.imageUrl}
          alt={currentAnimal.name}
          width="100"
          className="animal-image"
        />
      )}

      {showStartButton && (
        <button className="listen-button" onClick={startQuiz}>
          Start quiz
        </button>
      )}

      {quizStatus === 'in_progress' && (
        <p className="listening-status">
          {isListening ? 'Listening...' : 'Processing...'}
        </p>
      )}

      <h2>Heard: {transcript || '...'}</h2>

      <h1>{getFeedbackMessage(quizStatus, feedback, transcript, totalRounds)}</h1>
    </div>
  );
}

export default VoiceQuizView;
