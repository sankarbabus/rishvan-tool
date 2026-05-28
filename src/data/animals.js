export const ANIMALS = [
  {
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    name: 'dog',
  },
  {
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    name: 'elephant',
  },
  {
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
    name: 'koala',
  },
];

function shuffleAnimals(animals) {
  const shuffled = [...animals];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function createQuizQueue(roundCount) {
  const queue = [];

  while (queue.length < roundCount) {
    queue.push(...shuffleAnimals(ANIMALS));
  }

  return queue.slice(0, roundCount);
}
