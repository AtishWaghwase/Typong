# **Typong** : Pong Breaker Using Keyboard Input

- **URL:** https://github.com/AtishWaghwase/Typong

- **Name:** Atish Waghwase

- **KAIST ID:** 20236043

- **Table of Contents:**
  - [Motivation](#motivation)
  - [Description](#description)
  - [Blueprint](#blueprint)
  - [Challenges and Learning](#challenges-and-learning)

<br>

## Introduction

Typong is based on Pong Breaker, a classic game that involves a ball and an array of bricks that need to be destroyed by shooting the ball at them.

There is a ball which travels at a constant speed and bounces off the top, left and right edges of the screen, however if it touches the bottom edge, the game is over. To keep it from doing so, there is a strip of 15 bricks that lies on the bottom edge which the ball can bounce off of. Every time the ball bounces off a brick, you gain a point, however the brick gets destroyed. In its place, a random five-letter word appears. In order to spawn the brick again, type the newly appeared word. You can see a preview of what you type at the centre of the screen. This game adds challenge by spawning one additional ball every three points; like the mythical creature Hydra.

The goal of the game is to score the maximum amount of points by continually spawning bricks as they get destroyed, thus keeping the balls from reaching the bottom edge.

## Overview

The game is built using [P5.JS](https://p5js.org/get-started/) and [Vite](https://vitejs.dev/) using the [template](https://github.com/makinteract/p5js-vite) provided by MAKInteract Lab. It uses the [random-words](https://www.npmjs.com/package/random-words) npm package to generate random five-letter words. The main code is contained in `game.js` while the supporting functions are organised into three files, viz. `physics.js`, `draw.js` and `utilities.js`. 

It uses factories to generate bricks and balls like so:

```js
export function BallFactory() {
  this.createBall = function (x, y, xSpeed, ySpeed) {
    let ball = {};
    ball.x = x;
    ball.y = y;
    ball.xSpeed = xSpeed;
    ball.ySpeed = ySpeed;
    return ball;
  };
}

export function BrickFactory() {
  this.createBrick = function (i, state, word) {
    let brick = {};
    brick.index = i;
    brick.solid = state;
    brick.word = word;
    return brick;
  };
}
```



<br>

---

## npm scripts

- `npm run dev` - Starts the development server at port [3000](http://localhost:3000/)
- `npm run build` - Builds the application in a `dist` folder
- `npm run preview` - Serves the build files (`dist` folder) locally at port [5000](http://localhost:3000/)

Note that if after this last command you do not see anything, you can use instead this other command:

- `npm run preview --host` - You should then be able to see your files locally at port [5000](http://localhost:3000/)

## A single p5.js sketch

```js
import "../css/style.css";
import { sketch } from "p5js-wrapper";

sketch.setup = function () {
  createCanvas(800, 600);
};

sketch.draw = function () {
  background(127); // grey
  fill(255, 0, 0); // red
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height / 2, 50, 50);
};

sketch.mousePressed = function () {
  console.log(`I am here at ${mouseX}:${mouseY}`);
};
```

And here the body of the html file:

```html
<body>
  <script type="module" src="/src/single_sketch.js"></script>
</body>
```

## Multiple p5.js sketches

If you want to use multiple sketches, you need to use a different syntax.

```js
import "../css/style.css";
import { p5 } from "p5js-wrapper";

let sketch1 = new p5((p) => {
  p.setup = () => {
    const one = document.getElementById("one");
    p.createCanvas(one.clientWidth, one.clientHeight);
  };

  p.draw = () => {
    p.background(100);
  };
}, "one");

// Sketch2
let sketch2 = new p5((p) => {
  p.setup = () => {
    const two = document.getElementById("two");
    p.createCanvas(two.clientWidth, two.clientHeight);
  };

  p.draw = () => {
    p.background(170);
  };
}, "two");
```

This file is expecting two divs in the html file:

```html
<body>
  <script type="module" src="/src/multi_sketch.js"></script>
  <div id="one"></div>
  <div id="two"></div>
</body>
```

## Adding sound

Sound is an [experimental feature](https://github.com/makinteract/p5js-wrapper/blob/main/README_SOUND.md).

Examples usage:

```js
import { sketch } from "p5js-wrapper";
import "p5js-wrapper/sound";

import mysound from "./mysound.mp3";

let soundEffect;

sketch.setup = function () {
  createCanvas(100, 100);
  soundEffect = loadSound(mysound);
};

sketch.draw = function () {
  background("#eeeeee");
};

// Play sound on click
sketch.mousePressed = function () {
  soundEffect.play();
};
```

This example assumes you have a file _mysound.mp3_ in the _src_ folder.

## License

This project is open source and available under the [MIT License](LICENSE).
