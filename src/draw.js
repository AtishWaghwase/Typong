import { getHighestY } from "./utilities";

export function drawBackground(h, balls, backgroundColor) {
  let yMax = getHighestY(balls);
  let to = color(100, 70, 160);
  let from = color(21, 37, 94);

  if (!(yMax > (h * 4) / 5)) {
    yMax = (h * 4) / 5;
  }

  backgroundColor = map(yMax, (h * 4) / 5, h, 0, 1);
  let newCol = lerpColor(from, to, backgroundColor);
  background(newCol);
}

export function drawLoadscreen(w, h, currentScore) {
  fill(200);
  textSize(h / 40);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text(" TYPONG: Hail Hydra!™", (w * 1) / 7, (h * 1) / 5);
  textStyle(NORMAL);

  if (currentScore > 0) {
    fill(200, 200, 255);
    textSize(h / 16);
    textStyle(BOLD);
    text(`Score: ${currentScore}`, (w * 1) / 7, (h * 2) / 5);
    textStyle(NORMAL);
    fill(200);
  }

  textSize(h / 32);
  textWrap(WORD);
  textAlign(LEFT, BOTTOM);
  textLeading((h / 32) * 1.5);
  text(
    "Don't let the ball touch the bottom! When a ball bounces off a brick, it gives you one point and destroys the brick. Type the words that appear in their place to rebuild them. A new ball will spawn every three points!",
    (w * 1) / 7,
    (h * 3) / 5,
    (w * 5) / 7
  );
  textSize(h / 32);
  textStyle(BOLD);

  fill(255);
  text("Click to play >>", (w * 1) / 7, (h * 4) / 5);
  textStyle(NORMAL);

  textAlign(LEFT, BASELINE);
}

export function drawBall(ball, BALL_RADIUS, h, brickHeight) {
  if (ball.y > h - brickHeight) {
    fill(255, 100, 100);
  } else if (ball.ySpeed >= 0) {
    fill(200, 200, 255);
  } else {
    fill(100, 100, 160);
  }
  noStroke();
  circle(ball.x, ball.y, BALL_RADIUS * 2);
}

export function explodeBall(x, y, w, game) {
  let transparency = map(game.explosionSize, 0, w * 2, 255, 0);
  fill(200, 100, 100, transparency);
  circle(x, y, game.explosionSize);
  game.explosionSize += 50;
  if (game.explosionSize > w * 3) {
    game.explosionSize = 0;
    game.explosion = false;
  }
}

export function drawInput(w, h, game) {
  fill(200);
  textSize(100);
  textAlign(CENTER, CENTER);
  text(game.input, w / 2, h / 2);
  textAlign(LEFT, BASELINE);
  textSize(15);
}

export function drawBrick(brick, x, y, brickWidth, brickHeight) {
  brick.solid ? fill(72, 61, 139) : fill(0, 0, 50, 0, 0);
  rect(x, y, brickWidth, brickHeight);

  let txtSize = brickWidth / 5;
  let txtWidth = textWidth(brick.word);
  let txtX = x + (brickWidth - txtWidth) / 2;
  let txtY = y + (brickHeight + txtSize) / 2;

  brick.solid ? fill(72, 61, 139, 0) : fill(255);
  textSize(txtSize);
  text(brick.word, txtX, txtY);
}

export function drawScore(w, h, scoreHeight, currentScore) {
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(200);
  text(`Score: ${currentScore}`, w / 2, scoreHeight / 2);
  textSize(15);
}
