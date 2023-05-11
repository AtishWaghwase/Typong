import "../css/style.css";
import { sketch } from "p5js-wrapper";
import randomWords from "random-words";

let x, y;
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

function centeredText(brick, x, y, brickWidth) {
  let txtSize = brickWidth / 5;
  let txtWidth = textWidth(brick.word);
  let txtX = x + (brickWidth - txtWidth) / 2;
  let txtY = y + (BRICK_HEIGHT + txtSize) / 2;
  fill(0);
  textSize(txtSize);
  text(brick.word, txtX, txtY);
}

function giveSpeed(ball) {
  ball.x = ball.x + ball.xSpeed;
  ball.y = ball.y + ball.ySpeed;
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
      console.log("triggered");
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
        word.length === length &&
        !words.includes(word) &&
        !dictionary.includes(word)
    );
    words.push(...newWords);
  }
  return words.map((word) => word.toUpperCase());
}

sketch.setup = function () {
  // createCanvas(displayWidth, displayHeight);
  createCanvas((displayWidth * 3) / 4, (displayHeight * 3) / 4);

  let factory = new BallFactory();
  let newBall = factory.createBall(width / 2, height / 2, 0, ySpeed);
  balls.push(newBall);

  for (let brick = 0; brick < TOTAL_BRICKS; brick++) {
    const brickFactory = new BrickFactory();
    bricks.push(brickFactory.createBrick(brick, true, `Word ${brick}`));
  }

  x = width / 2;
  y = height / 2;

  let dictionary = generateRandomWords(TOTAL_BRICKS, 5);
  console.log(dictionary);
  dictionary.pop();
  dictionary.pop();
  dictionary.pop();
  dictionary.pop();
  dictionary.pop();
  dictionary.push(generateRandomWords(1, 5)[0]);
  dictionary.push(generateRandomWords(1, 5)[0]);
  dictionary.push(generateRandomWords(1, 5)[0]);
  dictionary.push(generateRandomWords(1, 5)[0]);
  dictionary.push(generateRandomWords(1, 5)[0]);
  console.log(dictionary);
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
    fill(0, 255, 0);
    rect(x, y, brickWidth, BRICK_HEIGHT);
    centeredText(brick, x, y, brickWidth);
    balls.forEach((ball) => {
      checkBrickCollision(x, y, brick, brickWidth, ball);
    });
  });

  fill(255);
  text(currentText, 20, height - 10);
};

sketch.keyPressed = function () {
  if (keyCode === BACKSPACE) {
    currentText = currentText.slice(0, -1);
  } else if (currentText.length >= 4) {
    // clear currentText
    currentText = "";
  } else if (key.length === 1) {
    currentText += key;
  }
};

sketch.mousePressed = function () {
  console.log("here");
};
