let docWidth = document.documentElement.clientWidth;
let docHeight = document.documentElement.clientHeight;
let canvas;
let nyancat;
let nyanTrail;
let rectSpd = 30;
let xPos = docWidth/2;
class Trail {
    constructor() {
        this.trail = [];
    }

    add(x, y) {
        this.trail.push([x,y]);
    }

    show() {
        for (let coords of this.trail) {
            rect(coords[0], coords[1], 200, 100);
        }
    }
    update() {
        this.trail.forEach(trailCoords => {
            trailCoords[0] -= rectSpd;
        })
        this.removeOB();
    }

    removeOB() {
        for (let i = 0; i < this.trail.length; ++i) {
            if (this.trail[i][0] < 0) {
                this.trail.splice(i, 1);
            }
        }
    }
}

function setup() {
    canvas = createCanvas(docWidth, docHeight);
    background(53, 87, 140);
    frameRate(60);
    nyanTrail = new Trail();
}
function preload() {    
    nyancat = loadImage('unnamed.png');
}

function draw() {
    background(53, 87, 140);
    image(nyancat, docWidth/2, mouseY);
    fill(242,245,56);
    rect(docWidth/2-50, mouseY+50, 100,100);
    nyanTrail.show();
    nyanTrail.update();
    nyanTrail.add(xPos-50, mouseY+50);
}