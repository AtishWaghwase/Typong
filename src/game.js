import "../css/style.css";
import { p5, sketch } from "p5js-wrapper";

let x, y, ballOne;
let currentText = "";

const SIZE = 50;
const BALL_RADIUS = 25;
const BRICK_HEIGHT = 30;
const TOTAL_BRICKS = 15;

let ySpeed = 5;
let xSpeed = Math.random() * 3 + 2;

let balls = [];
let bricks = [];

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
  let txtSize = brickWidth / 4;
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
      console.log(brick.solid);
      brick.solid = false;
      console.log(brick.solid);
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

        console.log(brick.solid);
        brick.solid = false;
        console.log(brick.solid);
      }
    });
  }
}

sketch.setup = function () {
  // createCanvas(displayWidth, displayHeight);
  createCanvas((displayWidth * 3) / 4, (displayHeight * 3) / 4);

  let factory = new BallFactory();
  let newBall = factory.createBall(width / 2, height / 2, 0, ySpeed);
  balls.push(newBall);
  // console.log(balls);

  let brickFactory = new BrickFactory();
  let newBrick = brickFactory.createBrick(1, true, "AGAIN");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(3, true, "AGILE");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(4, true, "AGILE");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(5, true, "AFTER");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(7, true, "AFTER");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(9, true, "AFTER");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(11, true, "AFTER");
  bricks.push(newBrick);

  console.log(bricks);

  x = width / 2;
  y = height / 2;
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
    console.log(`Index: ${brick.index}, State: ${brick.solid}`);
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

sketch.mousePressed = function () {
  console.log("here");
};
