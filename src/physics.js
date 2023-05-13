import { replaceWord } from "./utilities";

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

export function giveSpeed(ball) {
  ball.x = ball.x + ball.xSpeed;
  ball.y = ball.y + ball.ySpeed;
}

export function spawnBall(ySpeed, balls, game) {
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

export function reduceSpeed(balls, SPEED_REDUCER) {
  balls.forEach((ball) => {
    if (Math.abs(ball.ySpeed) < 1) {
      console.log("too slow");
    } else {
      ball.ySpeed /= SPEED_REDUCER;
      console.log(ball.ySpeed);
    }
  });
}

export function randomSpeed(max) {
  return Math.random() * max;
}

export function checkBorderCollision(
  width,
  height,
  ball,
  scoreHeight,
  brickHeight,
  BALL_RADIUS
) {
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

export function checkBrickCollision(
  x,
  y,
  brick,
  width,
  ball,
  game,
  BALL_RADIUS,
  dictionary
) {
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

    replaceWord(brick, dictionary);

    brick.solid = false;
  }
}

export function activateBrick(string, bricks) {
  bricks.map((brick) => {
    if (brick.word === string) {
      console.log(`Brick ${brick.word} set to true`);
      brick.solid = true;
    }
  });
}
