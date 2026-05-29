export const ANIMALS = [
  {
    imageUrl: 'assets/dog.png',
    name: 'chien',
  },
  {
    imageUrl: 'assets/elephant.png',
    name: 'éléphant',
  },
  {
    imageUrl: 'assets/koala.png',
    name: 'koala',
  },
  {
    imageUrl: 'assets/lion.png',
    name: 'lyon',
  },
  {
    imageUrl: 'assets/tiger.png',
    name: 'tigre',
  },
  /*{
    imageUrl: 'assets/zebra.png',
    name: 'zebra',
  },
  {
    imageUrl: 'assets/giraffe.png',
    name: 'girafe',
  },
  {
    imageUrl: 'assets/panda.png',
    name: 'panda',
  },*/
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
