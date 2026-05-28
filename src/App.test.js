import { render, screen } from '@testing-library/react';

import App from './App';

class MockSpeechRecognition {
  continuous = false;
  lang = '';
  interimResults = false;

  start = jest.fn();
  stop = jest.fn();

  onstart = null;
  onresult = null;
  onerror = null;
  onend = null;
}

beforeEach(() => {
  window.SpeechRecognition = MockSpeechRecognition;
  window.webkitSpeechRecognition = MockSpeechRecognition;
});

test('renders voice quiz UI', () => {
  render(<App />);

  expect(screen.getByText('Voice Recognition Demo')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Start Listening' })).toBeInTheDocument();
  expect(screen.getByText('START SPEAKING!')).toBeInTheDocument();
});
