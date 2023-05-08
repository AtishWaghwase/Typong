import "../css/style.css";
import { p5, sketch } from "p5js-wrapper";

let x, y, ballOne;

const SIZE = 50;
const BRICK_HEIGHT = 40;

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
  let newBrick = brickFactory.createBrick(2, true, "AGAIN");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(5, true, "AGILE");
  bricks.push(newBrick);
  newBrick = brickFactory.createBrick(1, true, "AFTER");
  bricks.push(newBrick);
  console.log(bricks);

  x = width / 2;
  y = height / 2;
};

sketch.draw = function () {
  background(0, 0, 50);
  fill(255, 0, 0);
  noStroke();
  rectMode(CENTER);

  balls.forEach((ball) => {
    ellipse(ball.x, ball.y, SIZE, SIZE);
    giveSpeed(ball);
    checkCollision(ball);
  });

  bricks.forEach((brick) => {
    const brickWidth = width / 10;
    rectMode(CORNER);
    fill(0, 255, 0);
    rect(
      brickWidth * brick.index,
      (displayHeight * 3) / 4 - BRICK_HEIGHT,
      brickWidth,
      BRICK_HEIGHT
    );
    fill(255);
    textSize(BRICK_HEIGHT / 2);
    text(
      brick.word,
      brickWidth * brick.index,
      (displayHeight * 3) / 4 - BRICK_HEIGHT / 3
    );
  });
};

sketch.mousePressed = function () {
  console.log("here");
};
