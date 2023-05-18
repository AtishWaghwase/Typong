import "../css/style.css";
import { sketch } from "p5js-wrapper";
import {
  BallFactory,
  BrickFactory,
  giveSpeed,
  reduceSpeed,
  spawnBall,
  checkBorderCollision,
  checkBrickCollision,
  activateBrick,
} from "./physics";
import { generateRandomWords, checkWord } from "./utilities";
import {
  drawBall,
  drawBrick,
  drawInput,
  drawScore,
  drawLoadscreen,
  drawBackground,
  explodeBall,
} from "./draw";

let scoreHeight, brickHeight;
let ySpeed = 7;
let xSpeed = Math.random() * 5;
let backgroundColor = 0;

const BALL_RADIUS = 25;
const TOTAL_BRICKS = 15;
const SPAWN_THRESHOLD = 3;
const SCORE_HEIGHT = 2 / 24;
const BRICK_HEIGHT = 1 / 24;
const SPEED_REDUCER = 1.5;

let balls = [];
let bricks = [];
let dictionary = [];

let game = {
  running: true,
  input: "",
  collisionCounter: 0,
  scoreCounter: 0,
  lastBallX: 0,
  lastBallY: 0,
  explosion: false,
  explosionSize: 0,
};

export function newGame(w, h) {
  game.input = "";
  game.collisionCounter = 0;
  balls = [];
  bricks = [];

  let factory = new BallFactory();
  let newBall = factory.createBall(w / 2, h / 2, xSpeed, -ySpeed);
  balls.push(newBall);

  dictionary = generateRandomWords(TOTAL_BRICKS);

  for (let index = 0; index < TOTAL_BRICKS; index++) {
    const brickFactory = new BrickFactory();
    bricks.push(brickFactory.createBrick(index, true, `${dictionary[index]}`));
  }
}

sketch.setup = function () {
  const w = windowWidth;
  const h = windowHeight;
  ySpeed = h / 100;
  createCanvas(w, h);
  textFont("Verdana");
  newGame(w, h);
};

sketch.draw = function () {
  const w = windowWidth;
  const h = windowHeight;
  scoreHeight = h * SCORE_HEIGHT;
  brickHeight = h * BRICK_HEIGHT;

  drawBackground(h, balls, backgroundColor);
  drawInput(w, h, game);

  if (!game.running) {
    drawLoadscreen(w, h, game.scoreCounter);
  }

  if (game.running) {
    balls.forEach((ball) => {
      drawBall(ball, BALL_RADIUS, h, brickHeight);
      giveSpeed(ball);
      checkBorderCollision(width, height, ball, game, brickHeight, BALL_RADIUS);
    });

    bricks.forEach((brick) => {
      const brickWidth = w / TOTAL_BRICKS;
      const x = brickWidth * brick.index;
      const y = h - brickHeight;
      drawBrick(brick, x, y, brickWidth, brickHeight);

      balls.forEach((ball) => {
        checkBrickCollision(
          x,
          y,
          brick,
          brickWidth,
          ball,
          game,
          BALL_RADIUS,
          dictionary
        );
      });
    });

    drawScore(w, h, scoreHeight, game.scoreCounter);

    if (game.collisionCounter >= SPAWN_THRESHOLD) {
      spawnBall(ySpeed, balls, game);
      reduceSpeed(balls, SPEED_REDUCER);
    }
  }

  if (game.explosion) {
    explodeBall(game.lastBallX, game.lastBallY, w, game);
  }
};

sketch.keyPressed = function () {
  if (game.running) {
    if (keyCode === BACKSPACE) {
      game.input = game.input.slice(0, -1);
    } else if (keyCode === 32) {
      game.input = "";
    } else if (game.input.length >= 4) {
      game.input += key.toUpperCase();
      if (checkWord(game.input, dictionary)) {
        activateBrick(game.input, bricks);
      }
      game.input = "";
    } else if (key.length === 1) {
      game.input += key.toUpperCase();
    }
  }
};

sketch.mousePressed = function () {
  const w = windowWidth;
  const h = windowHeight;
  if (game.running) {
    game.running = false;
    newGame(w, h);
  } else {
    game.running = true;
    game.scoreCounter = 0;
  }
};

sketch.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
