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

export function pickRandomAnimal() {
  const index = Math.floor(Math.random() * ANIMALS.length);
  return ANIMALS[index];
}
