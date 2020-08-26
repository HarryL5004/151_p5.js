let x =3;
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
  rect(x,100,100,100);
  if (x > width) {
    x = 0;
  }
  else {
    x += 3;
  }
}
