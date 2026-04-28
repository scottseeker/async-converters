// A minimal lorem ipsum word pool — no external dependency
const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa officia deserunt mollit anim id est laborum'.split(' ');

function sentence(): string {
  const len = 8 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, (_, i) =>
    i === 0
      ? WORDS[Math.floor(Math.random() * WORDS.length)].replace(/^./, c => c.toUpperCase())
      : WORDS[Math.floor(Math.random() * WORDS.length)]
  );
  return words.join(' ') + '.';
}

export function generateLorem(paragraphs: number, sentencesPerParagraph: number): string {
  return Array.from({ length: paragraphs }, () =>
    Array.from({ length: sentencesPerParagraph }, sentence).join(' ')
  ).join('\n\n');
}
