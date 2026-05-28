import VoiceQuizView from './components/VoiceQuizView';
import { useAnimalVoiceQuiz } from './hooks/useAnimalVoiceQuiz';

function App() {
  const quiz = useAnimalVoiceQuiz();

  return <VoiceQuizView {...quiz} />;
}

export default App;
