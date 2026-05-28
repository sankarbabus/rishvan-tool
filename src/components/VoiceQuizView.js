import '../App.css';

const FEEDBACK_MESSAGES = {
  idle: 'START SPEAKING!',
  correct: (transcript) => `[${transcript}] is Correct, congratulations!`,
  wrong: (transcript) => `[${transcript}] is Wrongly DETECTED, try again!`,
};

function getFeedbackMessage(feedback, transcript) {
  if (feedback === 'idle') {
    return FEEDBACK_MESSAGES.idle;
  }

  const messageBuilder = FEEDBACK_MESSAGES[feedback];
  return messageBuilder(transcript);
}

function VoiceQuizView({
  isListening,
  transcript,
  currentAnimal,
  startListening,
  feedback,
}) {
  return (
    <div className="voice-quiz">
      <h1>Voice Recognition Demo</h1>

      {currentAnimal && (
        <img
          src={currentAnimal.imageUrl}
          alt={currentAnimal.name}
          width="100"
          className="animal-image"
        />
      )}

      <button className="listen-button" onClick={startListening}>
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>

      <h2>Heard: {transcript || '...'}</h2>

      <h1>{getFeedbackMessage(feedback, transcript)}</h1>
    </div>
  );
}

export default VoiceQuizView;
