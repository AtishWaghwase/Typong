import { wordList } from "./words";

export function replaceWord(brick, dictionary) {
  let newWord = generateRandomWords(1)[0];
  while (dictionary.some((word) => word === newWord)) {
    newWord = generateRandomWords(1)[0];
  }
  brick.word = newWord;
  dictionary[brick.index] = brick.word;
}

export function generateRandomWords(n) {
  const fiveLetterWords = wordList.filter((word) => word.length === 5);
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
    result.push(fiveLetterWords[randomIndex]);
    fiveLetterWords.splice(randomIndex, 1);
  }
  return result.map((word) => word.toUpperCase());
}

export function getHighestY(balls) {
  return balls.reduce((maxY, ball) => {
    return ball.y > maxY ? ball.y : maxY;
  }, -Infinity);
}

export function checkWord(string, dictionary) {
  return dictionary.some((word) => word === string);
}
