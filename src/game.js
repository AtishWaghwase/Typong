import "../css/style.css";
import { sketch } from "p5js-wrapper";

sketch.setup = function () {
  createCanvas(displayWidth, displayHeight);
};

sketch.draw = function () {
  background(100);
  fill(255, 0, 0);
  noStroke();
  rectMode(CENTER);
  rect(mouseX, mouseY, 50, 50);
};

sketch.mousePressed = function () {
  console.log("here");
};
