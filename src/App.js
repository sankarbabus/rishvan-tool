import React, { useEffect, useRef, useState } from 'react';

import correctSound from './audio/correctAnswer.mp3';
import wrongSound from './audio/wrongAnswer.mp3';

function App() {

  const animals = [
    "https://cdn-icons-png.flaticon.com/512/616/616408.png---dog", 
    "https://cdn-icons-png.flaticon.com/512/616/616430.png---elephant", 
    "https://cdn-icons-png.flaticon.com/512/3069/3069172.png---koala"
  ];
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [animalImage, setAnimalImage] = useState('');
  const [animalName, setAnimalName] = useState('');
  const animalNameRef = useRef('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Browser support check
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
      console.log('Listening...');
      const randomNumber = Math.floor(Math.random() * 3);
      const animalUrl = animals[randomNumber].split('---')[0];
      const selectedAnimalName = animals[randomNumber].split('---')[1];
      //const animalName = animals[randomNumber].split('---')[1];
      console.log(`Random Number: ${randomNumber}, Animal URL: ${animalUrl} and Name: ${selectedAnimalName}`);
      setAnimalImage(animalUrl);
      setAnimalName(selectedAnimalName);
      animalNameRef.current = selectedAnimalName;
    };

    recognition.onresult = (event) => {
      console.log(`Entered with animalName as : ${animalNameRef.current}`);
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log(`You said: ${transcript}`);

      // CHECK ONLY FINAL RESULT
      const result = event.results[event.results.length - 1];

      if (result.isFinal) {
        console.log(`result.isFinal: ${result.isFinal}`);
        console.log(`transcript: ${transcript}`);
        console.log(`animalName: ${animalName}`);
          if (
          transcript.toLowerCase() === animalNameRef.current.toLowerCase()
        ) {
          console.log(`Correct answer`);
          executeSound(correctSound);
          recognition.stop();
        } else {
          console.log(`Wrong answer`);
          executeSound(wrongSound);
          recognition.stop();
        }
      }

      setText(transcript);
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
      setText('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const executeSound = (sound) => {
    console.log('Executing sound:', sound);
    const audio = new Audio(sound);
    audio.play();
  };

  return (
    <div style={styles.container}>
      <h1>Voice Recognition Demo</h1>
      <img
        src={animalImage}
        alt="Microphone"
        width="100"
        style={{ marginBottom: '20px' }}
      />

      <button style={styles.button} onClick={startListening}>
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>

      <h2>Heard: {text || '...'}</h2>
      
      {
        text === '' 
        ? 
        <h1>START SPEAKING!</h1> 
        :
          text.toLowerCase().includes(animalName.toLowerCase())
          ?
          <h1>
            [{text}] is Correct, congratulations!
          </h1>
          :
          <h1>
            [{text}] is Wrong ANIMAL DETECTED, try again!
          </h1>
      }
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial',
  },

  button: {
    padding: '15px 30px',
    fontSize: '20px',
    cursor: 'pointer',
    marginBottom: '30px',
  },
};

export default App;