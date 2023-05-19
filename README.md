# **Typong** : Pong Breaker Using Keyboard Input

- **Links:** [GitHub](https://github.com/AtishWaghwase/Typong), [YouTube](https://youtu.be/-b6wISvl8Wk)

- **Name:** Atish Waghwase

- **KAIST ID:** 20236043

- [**Typong** : Pong Breaker Using Keyboard Input](#typong--pong-breaker-using-keyboard-input)
  - [Introduction](#introduction)
  - [Overview](#overview)
  - [npm scripts](#npm-scripts)
  - [A single p5.js sketch](#a-single-p5js-sketch)
  - [Multiple p5.js sketches](#multiple-p5js-sketches)
  - [Adding sound](#adding-sound)
  - [License](#license)

<br>

## Introduction

Typong is based on Pong Breaker, a classic game that involves a ball and an array of bricks that need to be destroyed by shooting the ball at them. The goal of Typong is to score the maximum amount of points by spawning bricks as they get destroyed, thus keeping the balls from reaching the bottom edge.

There is a ball which travels at a constant speed and bounces off the top, left and right edges of the screen, however if it touches the bottom edge, the game is over. To keep it from doing so, there is a strip of 15 bricks that lies on the bottom edge which the ball can bounce off of. Every time the ball bounces off a brick, you gain a point, however the brick gets destroyed. In its place, a random five-letter word appears. In order to spawn the brick again, type the newly appeared word. You can see a preview of what you type at the centre of the screen. This game adds challenge by spawning one additional ball every three points.

## Overview

The game is built using [P5.JS](https://p5js.org/get-started/) and [Vite](https://vitejs.dev/) using the [template](https://github.com/makinteract/p5js-vite) provided by MAKInteract Lab. It uses the [random-words](https://www.npmjs.com/package/random-words) npm package to generate random five-letter words. The main code is contained in `game.js` while the supporting functions are organised into three files, viz. `physics.js`, `draw.js` and `utilities.js`.

The `sketch.setup()` function is used to set the width and height of the canvas as per the current window dimensions, and set the font to _Verdana_. Then it calls the function `newGame()`

```js
sketch.setup = function () {
  const w = windowWidth;
  const h = windowHeight;
  ySpeed = h / 100;
  createCanvas(w, h);
  textFont("Verdana");
  newGame(w, h);
};
```

The `newGame()` function resets the counters and clears the arrays `balls[]` and `bricks[]`. It creates a new ball at the centre of the canvas and adds it to `balls[]`. It also uses the `generateRandomWordss()` function to populate the `dictionary[]` which contains the words to be displayed at the bottom.

```js
// Ball and brick factories

let factory = new BallFactory();
let newBall = factory.createBall(w / 2, h / 2, Math.random() * 5, -ySpeed);
balls.push(newBall);

dictionary = generateRandomWords(TOTAL_BRICKS);

for (let index = 0; index < TOTAL_BRICKS; index++) {
  const brickFactory = new BrickFactory();
  bricks.push(brickFactory.createBrick(index, true, `${dictionary[index]}`));
}
```

The `sketch.draw()` function performs the following tasks:

1. Set variables `w`, `h`, `scoreHeight` and `brickHeight`.
2. Update the background using `drawBackground()`.
3. Update the current input shown on the background using `drawInput()`.
4. If game is paused, show the loadscreen using `drawLoadscreen()`.
5. if game is running.
   1. Update each ball by using `drawBall()` and `giveSpeed()`, and check if they collide with the borders using `checkBorderCollision()`.
   2. Calculate brick width using window width and total number of bricks. Draw each brick and check for collision of each ball using `checkBrickCollision()`.
6. Draw the current score near the top of the canvas.
7. After every 3 points, spawn a new ball using `spawnBall()` and reduce the speed of existing balls upto a certain limit using `reduceSpeed()` to keep the game difficulty playable.
8. If a ball touched the bottom edge, draw the explosion using `explodeBall()`.

```js
// Updating each ball and brick

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
    checkBrickCollision(x, y, brick, brickWidth, ball, game, BALL_RADIUS, dictionary);
  });
});
```

The `sketch.keyPressed()` function listens for keyboard input and uses four conditions:

1. If `Backspace` was pressed, delete the last character using `Array.slice()`.
2. If `Spacebar` was pressed, delete the whole word by assigning an empty string.
3. If the current word is equal to or longer than 5 characters, `checkWord()` if `game.input` matches any word in the `dictionary`.
   1. If yes, then activate the corresponding brick using `activateBrick()`. Display the current string for 100ms, and then reset it.
4. For any other keypress, confirm if input is 1 character long and add it to the current string in uppercase.

The `sketch.mousePressed()` function toggles `game.running`.

1. If the game was already running, then stop the game and call `newGame()`.
2. If the game was started after the previous round ended, set the `scoreCounter` to 0.
