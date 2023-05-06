import "style.css";
// import { sketch } from "p5js-wrapper";

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
