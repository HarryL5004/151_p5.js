let shapeCoord = [];
function setup() {
  createCanvas(document.documentElement.clientWidth, 
    document.documentElement.clientHeight);
}

function draw() {
  background(220, 100, 100);
  // if (mouseIsPressed) {
  //   fill(0);
  // } else {
  //   fill(255);
  // }
  // ellipse(mouseX,mouseY,50,50);
  fill(20,30,100);
  for (let shape of shapeCoord) {
    circle(shape[0], shape[1], 10);
  }
  circle(mouseX,mouseY, 10);
  if (mouseIsPressed) {
    shapeCoord.push([mouseX,mouseY]);
  }
}
