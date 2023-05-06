import "../css/style.css";
import { p5, sketch } from "p5js-wrapper";

let x, y, ballOne;

const SIZE = 50;

let ySpeed = 5;
let xSpeed = Math.random() * 3 + 2;

let balls = [];

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

sketch.setup = function () {
  createCanvas((displayWidth * 3) / 4, (displayHeight * 3) / 4);

  let factory = new BallFactory();
  let newBall = factory.createBall(width / 2, height / 2, xSpeed, ySpeed);
  balls.push(newBall);
  console.log(balls);

  x = width / 2;
  y = height / 2;
};

sketch.draw = function () {
  background(0, 0, 50);
  fill(255, 0, 0);
  noStroke();
  rectMode(CENTER);

  balls.forEach((ball) => {
    rect(ball.x, ball.y, SIZE, SIZE);
    ball.x = ball.x + ball.xSpeed;
    ball.y = ball.y + ball.ySpeed;

    if (ball.x < 0 || ball.x > width) {
      ball.xSpeed = -ball.xSpeed;
    }

    if (ball.y < 0 || ball.y > height) {
      ball.ySpeed = -ball.ySpeed;
    }
  });

  // rect(ballOne.x, ballOne.y, 50, 50);
  // ballOne.x = ballOne.x + xSpeed;
  // ballOne.y = ballOne.y - ySpeed;

  // if (ballOne.y < 0 || ballOne.y > height) {
  //   ballOne.ySpeed = -ballOne.ySpeed;
  // }

  // if (ballOne.x < 0 || ballOne.x > width) {
  //   ballOne.xSpeed = -ballOne.xSpeed;
  // }
};

sketch.mousePressed = function () {
  console.log("here");
};
