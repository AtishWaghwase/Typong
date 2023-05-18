import randomWords from "random-words";

export function replaceWord(brick, dictionary) {
  let newWord = generateRandomWords(1)[0];
  while (dictionary.some((word) => word === newWord)) {
    newWord = generateRandomWords(1)[0];
  }
  brick.word = newWord;
  dictionary[brick.index] = brick.word;
}

export function generateRandomWords(n) {
  let words = [];
  while (words.length < n) {
    let newWords = randomWords({ exactly: n - words.length });
    newWords = newWords.filter(
      (word) =>
        word.length === 5 && !words.includes(word) && !words.includes(word)
    );
    words.push(...newWords);
  }
  return words.map((word) => word.toUpperCase());
}

export function getHighestY(balls) {
  return balls.reduce((maxY, ball) => {
    return ball.y > maxY ? ball.y : maxY;
  }, -Infinity);
}

export function checkWord(string, dictionary) {
  return dictionary.some((word) => word === string);
}
