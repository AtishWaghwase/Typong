import { getHighestY } from "./utilities";

export function drawBackground(h, balls, backgroundColor) {
  let yMax = getHighestY(balls);
  let to = color(72, 61, 139);
  let from = color(0, 0, 50);
  // let from = color(218, 165, 32);

  if (yMax > (h * 4) / 5) {
  } else {
    yMax = (h * 4) / 5;
  }

  backgroundColor = map(yMax, (h * 4) / 5, h, 0, 1);

  let newCol = lerpColor(from, to, backgroundColor);

  background(newCol);
}

export function drawLoadscreen(w, h, currentScore) {
  fill(200);
  textAlign(CENTER, CENTER);
  textSize(30);
  text(`Current score: ${currentScore}`, w / 2, h / 4);
  textSize(100);
  text("Click to start", w / 2, h / 2);
  textAlign(LEFT, BASELINE);
  //   textSize(15);
}

export function drawBall(ball, BALL_RADIUS) {
  fill(200, 200, 255);
  noStroke();
  circle(ball.x, ball.y, BALL_RADIUS * 2);
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
  if (brick.solid) {
    fill(0, 50, 50);
  } else {
    fill(0, 0, 50, 0);
  }
  rect(x, y, brickWidth, brickHeight);

  let txtSize = brickWidth / 5;
  let txtWidth = textWidth(brick.word);
  let txtX = x + (brickWidth - txtWidth) / 2;
  let txtY = y + (brickHeight + txtSize) / 2;

  if (brick.solid) {
    fill(0, 50, 50);
    // fill(255);
  } else {
    fill(255);
  }

  textSize(txtSize);
  // console.log(brick.word, txtSize);
  // debugger;
  text(brick.word, txtX, txtY);
}

export function drawScore(w, h, scoreHeight, currentScore) {
  fill(0, 0, 50);
  // stroke("#d4d4d4");
  // strokeWeight(2);
  rect(0, 0, w, scoreHeight);
  // noStroke();
  fill(200);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(`Current score: ${currentScore}`, w / 2, scoreHeight / 2);
  textSize(15);
}
