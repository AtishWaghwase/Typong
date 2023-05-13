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
let words = [];

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
  return words.some((word) => word === string);
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
  if (brick.solid) {
    if (ball.y + BALL_RADIUS > y && ball.x > x && ball.x < x + width) {
      console.log("Collision");
      ball.ySpeed = -ball.ySpeed;
      brick.solid = false;
    }
    let corners = [
      { x: x, y: y },
      { x: x + width, y: y },
    ];
    corners.forEach((corner) => {
      let dx = corner.x - ball.x;
      let dy = corner.y - ball.y;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < BALL_RADIUS) {
        let angle = atan2(dy, dx);
        let normalX = cos(angle);
        let normalY = sin(angle);
        let dot = ball.xSpeed * normalX + ball.ySpeed * normalY;
        ball.xSpeed -= 2 * dot * normalX;
        ball.ySpeed -= 2 * dot * normalY;

        brick.solid = false;
      }
    });
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

sketch.setup = function () {
  createCanvas((displayWidth * 3) / 4, (displayHeight * 3) / 4);

  let factory = new BallFactory();
  let newBall = factory.createBall(width / 2, height / 2, 0, ySpeed);
  words = generateRandomWords(TOTAL_BRICKS, 5);
  balls.push(newBall);

  for (let index = 0; index < TOTAL_BRICKS; index++) {
    const brickFactory = new BrickFactory();
    bricks.push(brickFactory.createBrick(index, false, `${words[index]}`));
  }

  console.log(words);
};

sketch.draw = function () {
  background(0, 0, 50);
  fill(255, 0, 0);
  noStroke();

  balls.forEach((ball) => {
    circle(ball.x, ball.y, SIZE);
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
    // fill(0, 255, 0);
    rect(x, y, brickWidth, BRICK_HEIGHT);
    brickText(brick, x, y, brickWidth);
    balls.forEach((ball) => {
      checkBrickCollision(x, y, brick, brickWidth, ball);
    });
  });

  fill(255);
  text(currentText, 20, 30);
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
