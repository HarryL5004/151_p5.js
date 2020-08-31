// let shapeCoord = [];
let xPos, yPos;
let xSpd = 3;
let ySpd = 3;
let xDir = 1;
let yDir = 1;
let docWidth = document.documentElement.clientWidth;
let docHeight = document.documentElement.clientHeight;
let canvas;
function setup() {
  canvas = createCanvas(docWidth, docHeight);
  background(220, 100, 100);
  frameRate(60);
  stroke(22);
  xPos = 150;
  yPos = 150;
}

function draw() {  
  fill(20,30,100);
  xPos += xSpd * xDir;
  yPos += ySpd * yDir;
  if (xPos >= width-50|| xPos < 50) {
    xDir *= -1;
  }
  if (yPos >= height-50|| yPos < 50)
    yDir *= -1;
  if (mouseIsPressed) {
    fill(118, 255, 3);
  }  
  circle(xPos, yPos, 100);  
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    let randNum = Math.ceil(Math.random()*100);
    saveCanvas(canvas, 'p5canvas' + randNum, 'png');
  }
}    
