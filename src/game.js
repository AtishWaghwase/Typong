import "../css/style.css";
import { sketch } from "p5js-wrapper";
import randomWords from "random-words";

let currentText = "";

const SIZE = 50;
const BALL_RADIUS = 25;
const BRICK_HEIGHT = 30;
const TOTAL_BRICKS = 15;

let ySpeed = 5;
let xSpeed = Math.random() * 3 + 2;

let balls = [];
let bricks = [];
let dictionary = [];

function BallFactory() {
  this.createBall = function (x, y, xSpeed, ySpeed) {
    let ball = {};
    ball.x = x;
    ball.y = y;
    ball.xSpeed = xSpeed;
    ball.ySpeed = ySpeed;
    return ball;
  };
}

function BrickFactory() {
  this.createBrick = function (i, state, word) {
    let brick = {};
    brick.index = i;
    brick.solid = state;
    brick.word = word;
    return brick;
  };
}

function drawBall(ball) {
  fill(255, 0, 0);
  noStroke();
  circle(ball.x, ball.y, SIZE);
}

function drawCurrentText() {
  fill(200);
  textSize(100);
  text(currentText, 400, 400);
  textSize(15);
}

function brickText(brick, x, y, brickWidth) {
  let txtSize = brickWidth / 5;
  let txtWidth = textWidth(brick.word);
  let txtX = x + (brickWidth - txtWidth) / 2;
  let txtY = y + (BRICK_HEIGHT + txtSize) / 2;
  fill(255);
  textSize(txtSize);
  text(brick.word, txtX, txtY);
}

function giveSpeed(ball) {
  ball.x = ball.x + ball.xSpeed;
  ball.y = ball.y + ball.ySpeed;
}

function checkWord(string) {
  return dictionary.some((word) => word === string);
}

function activateBrick(string) {
  bricks.map((brick) => {
    if (brick.word === string) {
      console.log(`Brick ${brick.word} set to true`);
      brick.solid = true;
    }
  });
}

function checkBorderCollision(ball) {
  if (ball.x - BALL_RADIUS < 0 || ball.x + BALL_RADIUS > width) {
    ball.xSpeed = -ball.xSpeed;
  }

  if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > height) {
    ball.ySpeed = -ball.ySpeed;
  }
}

function checkBrickCollision(x, y, brick, width, ball) {
  if (!brick.solid) {
    return;
  }
  if (ball.y + BALL_RADIUS > y && ball.x > x && ball.x < x + width) {
    ball.ySpeed = -ball.ySpeed;
    console.log("Collision");

    replaceWord(brick);

    brick.solid = false;
  }
}

function generateRandomWords(n, length) {
  let words = [];
  while (words.length < n) {
    let newWords = randomWords({ exactly: n - words.length });
    newWords = newWords.filter(
      (word) =>
        word.length === length && !words.includes(word) && !words.includes(word)
    );
    words.push(...newWords);
  }
  return words.map((word) => word.toUpperCase());
}

function replaceWord(brick) {
  brick.word = generateRandomWords(1, 5)[0];
  dictionary[brick.index] = brick.word;
  console.log(`Brick ${brick.index} is now ${dictionary[brick.index]}`);
}

sketch.setup = function () {
  createCanvas((displayWidth * 3) / 4, (displayWidth * 3) / 5.5);

  let factory = new BallFactory();
  let newBall = factory.createBall(width / 2, height / 2, 0, -ySpeed);
  dictionary = generateRandomWords(TOTAL_BRICKS, 5);
  balls.push(newBall);

  for (let index = 0; index < TOTAL_BRICKS; index++) {
    const brickFactory = new BrickFactory();
    bricks.push(brickFactory.createBrick(index, false, `${dictionary[index]}`));
  }

  console.log(dictionary);
};

sketch.draw = function () {
  background(0, 0, 50);

  drawCurrentText();

  balls.forEach((ball) => {
    drawBall(ball);
    giveSpeed(ball);
    checkBorderCollision(ball);
  });

  bricks.forEach((brick) => {
    const brickWidth = width / TOTAL_BRICKS;
    const x = brickWidth * brick.index;
    const y = (displayHeight * 3) / 4 - BRICK_HEIGHT;
    if (brick.solid) {
      fill(0, 255, 0);
    } else {
      fill(0, 0, 50);
    }
    rect(x, y, brickWidth, BRICK_HEIGHT);
    fill(255);
    brickText(brick, x, y, brickWidth);
    balls.forEach((ball) => {
      checkBrickCollision(x, y, brick, brickWidth, ball);
    });
  });
};

sketch.keyPressed = function () {
  if (keyCode === BACKSPACE) {
    currentText = currentText.slice(0, -1);
  } else if (keyCode === 32) {
    // Ignore spaces
  } else if (currentText.length >= 4) {
    currentText += key.toUpperCase();
    if (checkWord(currentText)) {
      activateBrick(currentText);
    }
    currentText = "";
  } else if (key.length === 1) {
    currentText += key.toUpperCase();
  }
};

sketch.mousePressed = function () {
  console.log("here");
};
