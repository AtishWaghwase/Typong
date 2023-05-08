import "../css/style.css";
import { p5, sketch } from "p5js-wrapper";

let x, y, ballOne;

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

function checkCollision(ball) {
  if (ball.x - SIZE / 2 < 0 || ball.x + SIZE / 2 > width) {
    ball.xSpeed = -ball.xSpeed;
  }

  if (ball.y - SIZE / 2 < 0 || ball.y + SIZE / 2 > height) {
    ball.ySpeed = -ball.ySpeed;
  }
}

function checkCornerCollision(brick, x, y, width, height, ball) {
  let corners = [
    { x: x, y: y },
    { x: x + width, y: y },
    // { x: x + width, y: y + height },
    // { x: x, y: y + height },
  ];
  corners.forEach((corner) => {
    circle(corner.x, corner.y, 10);
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
      console.log(
        `Corner collision at brick ${brick.index} corner.x ${corner.x}, ball.x${ball.x}, corner.y ${corner.y}, ball.y${ball.y},`
      );
    }
  });
}

sketch.setup = function () {
  // createCanvas(displayWidth, displayHeight);
  createCanvas((displayWidth * 3) / 4, (displayHeight * 3) / 4);

  let factory = new BallFactory();
  let newBall = factory.createBall(
    width / 2,
    height / 2,
    Math.random() * 3 + 2,
    ySpeed
  );
  balls.push(newBall);
  // console.log(balls);

  let brickFactory = new BrickFactory();
  let newBrick = brickFactory.createBrick(1, true, "AGAIN");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(3, true, "AGILE");
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

sketch.draw = function () {
  background(0, 0, 50);
  fill(255, 0, 0);
  noStroke();

  balls.forEach((ball) => {
    circle(ball.x, ball.y, SIZE);
    giveSpeed(ball);
    checkCollision(ball);
  });

  bricks.forEach((brick) => {
    const brickWidth = width / TOTAL_BRICKS;
    const x = brickWidth * brick.index;
    const y = (displayHeight * 3) / 4 - BRICK_HEIGHT;
    fill(0, 255, 0);
    rect(x, y, brickWidth, BRICK_HEIGHT);
    centeredText(brick, x, y, brickWidth);
    balls.forEach((ball) => {
      checkCornerCollision(brick, x, y, brickWidth, BRICK_HEIGHT, ball);
    });
  });
};

sketch.mousePressed = function () {
  console.log("here");
};
