import "../css/style.css";
import { sketch } from "p5js-wrapper";
import randomWords from "random-words";

let scoreHeight, brickHeight;
let ySpeed = 5;
let xSpeed = Math.random() * 3;

const BALL_RADIUS = 25;
const TOTAL_BRICKS = 15;
const SPAWN_THRESHOLD = 3;

const SCORE_Y = 22 / 24;
const SCORE_HEIGHT = 2 / 24;
const BRICK_HEIGHT_TEMP = 1 / 24;
const ASPECT_RATIO = 9 / 16;
const SPEED_REDUCER = 1.5;

let balls = [];
let bricks = [];
let dictionary = [];

let game = {
  running: true,
  input: "",
  collisionCounter: 0,
  scoreCounter: 0,
};

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
  circle(ball.x, ball.y, BALL_RADIUS * 2);
}

function drawCurrentText() {
  fill(200);
  textSize(100);
  text(game.input, 400, 400);
  textSize(15);
}

function brickText(brick, x, y, brickWidth, brickHeight) {
  let txtSize = brickWidth / 5;
  let txtWidth = textWidth(brick.word);
  let txtX = x + (brickWidth - txtWidth) / 2;
  let txtY = y + (brickHeight + txtSize) / 2;
  fill(255);
  textSize(txtSize);
  text(brick.word, txtX, txtY);
}

function drawScore(w, h, scoreHeight) {
  // let y = h * SCORE_Y;
  fill(100, 50, 50);
  rect(0, 0, w, scoreHeight);
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

function checkBorderCollision(ball, scoreHeight, brickHeight) {
  if (ball.x - BALL_RADIUS < 0 || ball.x + BALL_RADIUS > width) {
    ball.xSpeed = -ball.xSpeed;
  }

  if (
    ball.y - scoreHeight - BALL_RADIUS < 0 ||
    ball.y + BALL_RADIUS > height - brickHeight + BALL_RADIUS * 2
  ) {
    ball.ySpeed = -ball.ySpeed;
  }
}

function checkBrickCollision(x, y, brick, width, ball) {
  if (!brick.solid) {
    return;
  }
  if (ball.y + BALL_RADIUS > y && ball.x > x && ball.x < x + width) {
    ball.ySpeed = -ball.ySpeed;

    game.collisionCounter += 1;
    game.scoreCounter += 1;
    console.log("Collision");
    console.log(game.collisionCounter);
    console.log(game.scoreCounter);

    replaceWord(brick);

    brick.solid = false;
  }
}

function generateRandomWords(n) {
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

function replaceWord(brick) {
  let newWord = generateRandomWords(1)[0];
  while (dictionary.some((word) => word === newWord)) {
    newWord = generateRandomWords(1)[0];
  }
  brick.word = newWord;
  dictionary[brick.index] = brick.word;
  console.log(`Brick ${brick.index} is now ${dictionary[brick.index]}`);
}

function randomBool() {
  let seed = Math.random();
  if (seed > 0.5) return true;
  else return false;
}

function randomSpeed(max) {
  return Math.random() * max;
}

function spawnBall() {
  let factory = new BallFactory();
  let newBall = factory.createBall(
    width / 2,
    height / 2,
    randomSpeed(3),
    -ySpeed
  );
  balls.push(newBall);
  game.collisionCounter = 0;
}

function reduceSpeed() {
  balls.forEach((ball) => {
    if (Math.abs(ball.ySpeed) < 1) {
      console.log("too slow");
    } else {
      ball.ySpeed /= SPEED_REDUCER;
      console.log(ball.ySpeed);
    }
  });
}

sketch.setup = function () {
  const w = displayHeight;
  const h = displayHeight * ASPECT_RATIO;
  createCanvas(w, h);

  let factory = new BallFactory();
  let newBall = factory.createBall(width / 2, height / 2, 0, -ySpeed);
  balls.push(newBall);

  dictionary = generateRandomWords(TOTAL_BRICKS);

  for (let index = 0; index < TOTAL_BRICKS; index++) {
    const brickFactory = new BrickFactory();
    bricks.push(brickFactory.createBrick(index, true, `${dictionary[index]}`));
  }

  console.log(dictionary);
};

sketch.draw = function () {
  const w = displayHeight;
  const h = displayHeight * ASPECT_RATIO;
  scoreHeight = h * SCORE_HEIGHT;
  brickHeight = h * BRICK_HEIGHT_TEMP;

  background(0, 0, 50);
  drawCurrentText();

  if (game.running) {
    balls.forEach((ball) => {
      drawBall(ball);
      giveSpeed(ball);
      checkBorderCollision(ball, scoreHeight, brickHeight);
    });

    bricks.forEach((brick) => {
      const brickWidth = w / TOTAL_BRICKS;
      const x = brickWidth * brick.index;
      const y = h - brickHeight;
      if (brick.solid) {
        fill(0, 255, 0);
      } else {
        fill(0, 0, 50);
      }
      rect(x, y, brickWidth, brickHeight);
      fill(255);
      brickText(brick, x, y, brickWidth, brickHeight);
      balls.forEach((ball) => {
        checkBrickCollision(x, y, brick, brickWidth, ball);
      });
    });

    drawScore(w, h, scoreHeight);

    if (game.collisionCounter >= SPAWN_THRESHOLD) {
      spawnBall();
      reduceSpeed();
      console.log(balls);
    }
  }
};

sketch.keyPressed = function () {
  if (keyCode === BACKSPACE) {
    game.input = game.input.slice(0, -1);
  } else if (keyCode === 32) {
    // Ignore spaces
  } else if (game.input.length >= 4) {
    game.input += key.toUpperCase();
    if (checkWord(game.input)) {
      activateBrick(game.input);
    }
    game.input = "";
  } else if (key.length === 1) {
    game.input += key.toUpperCase();
  }
};

sketch.mousePressed = function () {
  if (game.running) {
    game.running = false;
  } else {
    game.running = true;
  }
  console.log(game.running);
};
