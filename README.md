# **Typong** : Pong Breaker Using Keyboard Input

- **Links:** **[Play Typong](https://typong.netlify.app/)**, [GitHub](https://github.com/AtishWaghwase/Typong), [YouTube](https://youtu.be/-b6wISvl8Wk)

- **Name:** Atish Waghwase

- **KAIST ID:** 20236043

- [**Typong** : Pong Breaker Using Keyboard Input](#typong--pong-breaker-using-keyboard-input)
  - [Introduction](#introduction)
  - [Overview](#overview)
  - [Game.js](#gamejs)
  - [Physics.js](#physicsjs)
  - [Draw.js](#drawjs)
  - [Utilities.js](#utilitiesjs)
  - [References](#references)

<br>

## Introduction

Typong is based on Pong Breaker, a classic game that involves a ball and an array of bricks that need to be destroyed by shooting the ball at them. The goal of Typong is to score the maximum amount of points by spawning bricks as they get destroyed, thus keeping the balls from reaching the bottom edge.

![Cover Image](/assets/Cover.png)

<figcaption>Figure 1: Typong is a game that is based on Pong Breaker, and uses keyboard input.</figcaption>
<br>

### Gameplay

There is a ball which travels at a constant speed and bounces off the top, left and right edges of the screen, however if it touches the bottom edge, the game is over. To keep it from doing so, there is a strip of 15 bricks that lies on the bottom edge which the ball can bounce off of. Every time the ball bounces off a brick, you gain a point, however the brick gets destroyed. In its place, a random five-letter word appears. In order to spawn the brick again, type the newly appeared word. You can see a preview of what you type at the centre of the screen. This game adds challenge by spawning one additional ball every three points. Click the left mouse button at any time to stop the game; click again to start a new game.

## Overview

The game is built using [P5.JS](https://p5js.org/get-started/) and [Vite](https://vitejs.dev/) using the [template](https://github.com/makinteract/p5js-vite) provided by MAKInteract Lab. It uses the [random-words](https://www.npmjs.com/package/random-words) npm package to generate random five-letter words. The main code is contained in `game.js` while the supporting functions are organised into three files, viz. `physics.js`, `draw.js` and `utilities.js`. There is also `words.js` which is a directory of English words.

## Game.js

The `sketch.setup()` function is used to set the width and height of the canvas as per the current window dimensions, and set the font to _Verdana_. Then it calls the function `newGame()`. The `newGame()` function resets the counters and clears the arrays `balls[]` and `bricks[]`. It creates a new ball at the centre of the canvas and adds it to `balls[]`. It also uses the `generateRandomWords()` function to populate the `dictionary[]` which contains the words to be displayed at the bottom.

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

<br>

## Physics.js

This page contains the `BallFactory()` and the `BrickFactory()`, as well as the functions `giveSpeed()`, `spawnBall()`, `reduceSpeed()`, `checkBorderCollision()`, `checkBrickCollision()` and `activateBrick()`. These functions take in parameters and compute the physics of the game.

For example, here is the `checkBrickCollision()` function:

```js
// Handle ball collisions with the bricks

export function checkBrickCollision(x, y, brick, width, ball, game, BALL_RADIUS, dictionary) {
  if (!brick.solid) {
    return;
  }
  if (ball.y + BALL_RADIUS > y && ball.x > x && ball.x < x + width) {
    ball.ySpeed = -ball.ySpeed;

    game.collisionCounter += 1;
    game.scoreCounter += 1;
    brick.solid = false;
    replaceWord(brick, dictionary);
  }
}
```

Note that even though the ball is circular, this code is calculating a simple bounding box collision with the ball. This was done because adding a complex collision didn't contribute much to the experience. In fact, corner collision ended up directing the ball more horizontally than vertically. This meant the ball would keep bouncing between the left and right edges, which led to a long wait before the ball actually comes to the bricks. This is the corner collision mechanism that was tested:

```js
// Corner collision addition for checkBrickCollision()

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

    brick.solid = false;
  }
});
```

<br>

## Draw.js

### drawBackground()

The `drawBackground()` function changes the color based on the location of the ball closest to the bottom edge. Here is how it works:

1. It gets the location of the bottom most ball at any point of time.
2. If the ball is greater than 4/5 times the height, then it assigns its y-coordinate to `yMax`.
3. Beyond 4/5 times height, it maps the locations between `4/5 * h` and `h` to 0-1 to the variable `backgroundColor` . Then it uses the `lerpColor()` function to transition between the two colors using `backgroundColor`.

```js
// Change background color based on y-coordinate

export function drawBackground(h, balls, backgroundColor) {
  let yMax = getHighestY(balls);
  let to = color(100, 70, 160);
  let from = color(21, 37, 94);

  yMax = !(yMax > (h * 4) / 5) ? (h * 4) / 5 : yMax;
  backgroundColor = map(yMax, (h * 4) / 5, h, 0, 1);
  let newCol = lerpColor(from, to, backgroundColor);
  background(newCol);
}
```

<br>

### drawLoadscreen()

One thing to note is that this game defines all distances as ratios of `windowHeight` or `windowWidth`. This way it should work on all screen aspect rations (at least landscape ones). For example:

1. The bounding box for the score counter `SCORE_HEIGHT` and the height of the bricks `BRICK_HEIGHT` are actually multipliers for `windowHeight`.
2. The threshold for the background to change color is defined as 4/5 times the height.
3. Even the ySpeed is calculated as `h / 100`, and it is later reduced by `SPEED_REDUCER` by a factor of `1.5`.

![Loadscreen](/assets/Loadscreen.png)

<figcaption>Figure 2: Visual elements are placed in ratios of windowHeight and windowWidth for better scaling across displys.</figcaption>
<br>

However, some ratios are hard-coded; as they will be used only once, it did not make sense to parametrise them. Therefore you will find a lot of terms like `((h * 5) / 7)`. In drawLoadscreen(),

1. The name 'Typong™' is placed at `1/5 * h`
2. The primary text is placed at `2/5 * h` is contextual:
   1. If the score is zero, it displays `Are you ready?`.
   2. If the score is no-zero, it displays the score.
3. The rules of the game are placed at `3/5 * h`.
4. The CTA 'Click to play' is placed at `4/5 * h`.

<br>

![Ball states](assets/Ball%20States.png)

<figcaption>Figure 3: Ball states change depending on direction and y-coordinate.</figcaption>
<br>

### drawBall() and explodeBall()

The ball changes color based on direction and y-coordinate.

1. If the ball is going up, it has a dim purple color.
2. If the ball is going down, it has a bright purple color.
3. If the ball is beyond the line of bricks, it has a light red color.

```js
// Draw ball based on its y-coordinate

export function drawBall(ball, BALL_RADIUS, h, brickHeight) {
  if (ball.y > h - brickHeight) fill(255, 100, 100);
  else if (ball.ySpeed >= 0) fill(200, 200, 255);
  else fill(100, 100, 160);
  noStroke();
  circle(ball.x, ball.y, BALL_RADIUS * 2);
}
```

<br>

When the ball touches the bottom edge, it leads to an explosion effect. This is achieved by starting with a circle of zero radius and making it progressively larger every loop. The transparency is decreased as a function of size; which is calculated by `windowWidth`.

```js
// Animate an exploding ball

export function explodeBall(x, y, w, h, game) {
  let transparency = map(game.explosionSize, 0, w * 2, 255, 0);
  fill(200, 100, 100, transparency);
  circle(x, y, game.explosionSize);

  game.explosionSize += 50;
  if (game.explosionSize > w * 3) {
    game.explosionSize = 0;
    game.explosion = false;
    newGame(w, h);
  }
}
```

<br>

## Utilities.js

The `generateRandomWords()` function uses the word directory in `words.js` and returns `n` random words which do not repeat. This is ensured by using `Array.splice()`. Then it uses the `Array.map()` function and `String.toUppercase` to fetch words in the desired format.

The `getHighestY()` function iterates through all the balls to return the highest `ball.y` value. It makes use of `Array.reduce()` like so:

```js
export function getHighestY(balls) {
  return balls.reduce((maxY, ball) => {
    return ball.y > maxY ? ball.y : maxY;
  }, -Infinity);
}
```

<br>

## References

- [p5.js Documentation](https://p5js.org/reference/) was used heavily.

- The `BrickFactory()`, `BallFactory()`, `generateRandomWords()` and `getHighestY()` functions were referenced from the internet.

- GPT-4 was used for some functions and simplify using syntax-sugar.
