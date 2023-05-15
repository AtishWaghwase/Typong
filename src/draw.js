export function drawLoadscreen(w, h, currentScore) {
  fill(200);
  textAlign(CENTER, CENTER);
  textSize(30);
  text(`Current score: ${currentScore}`, w / 2, h / 4);
  textSize(100);
  text("Click to start", w / 2, h / 2);
  textAlign(LEFT, BASELINE);
  textSize(15);
}

export function drawBall(ball, BALL_RADIUS) {
  fill(255, 0, 0);
  noStroke();
  circle(ball.x, ball.y, BALL_RADIUS * 2);
}

export function drawCurrentText(w, h, game) {
  fill(200);
  textSize(100);
  textAlign(CENTER, CENTER);
  text(game.input, w / 2, h / 2);
  textAlign(LEFT, BASELINE);
  textSize(15);
}

export function drawBrick(brick, x, y, brickWidth, brickHeight) {
  if (brick.solid) {
    fill(0, 50, 50);
  } else {
    fill(0, 0, 50);
  }
  rect(x, y, brickWidth, brickHeight);

  let txtSize = brickWidth / 5;
  let txtWidth = textWidth(brick.word);
  let txtX = x + (brickWidth - txtWidth) / 2;
  let txtY = y + (brickHeight + txtSize) / 2;

  fill(255);
  textSize(txtSize);
  text(brick.word, txtX, txtY);
}

export function drawScore(w, h, scoreHeight, currentScore) {
  fill(0, 0, 0);
  rect(0, 0, w, scoreHeight);
  fill(200);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(`Current score: ${currentScore}`, w / 2, scoreHeight / 2);
  textSize(15);
}
