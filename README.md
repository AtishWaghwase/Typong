# **Typong** : Pong Breaker with Keyboard Input

- **URL:** http://git.prototyping.id/20236043/homework5.git

- **Name:** Atish Waghwase

- **KAIST ID:** 20236043

- **Table of Contents:**
  - [Motivation](#motivation)
  - [Description](#description)
  - [Blueprint](#blueprint)
  - [Challenges and Learning](#challenges-and-learning)

<br>

## Motivation

I really appreciate a good typing experience, and every since I got my first mechanical keyboard, I love typing with it. Mindlessly typing on MonkeyType has almost become a fidgeting mechanism for me, but I have always appreciated the design of the website. I have long been curious about how it was built, since it looks simple enough to code yet challenging enough to get right.

Therefore, I want to make a game that uses typing as input, rather than using traditional input keys.

<br>

## Live demo

For a live demo please [visit this page](https://p5js-vite-demo.surge.sh).

## Installation

Pull the template files with [degit](https://github.com/Rich-Harris/degit) and install dependencies.

```
npx degit makinteract/p5js-vite my-project

cd my-project
npm install
npm run dev
```

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
