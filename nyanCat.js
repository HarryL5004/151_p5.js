let docWidth = document.documentElement.clientWidth;
let docHeight = document.documentElement.clientHeight;
let canvas;
let nyancat;
let nyanMusic;

let nyanTrail;
let rectSpd = 30;
let trailXPos = docWidth/2-130;
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
    // nyancat = loadImage('assets/nyancat.png');
    nyancat = createImg('assets/nyanCat.gif');
    soundFormats('ogg', 'mp3');
    nyanMusic = loadSound('assets/nyanCat');
}

function draw() {
    background(53, 87, 140);
    fill(242,245,56);
    
    let trailYPos = mouseY+50;
    rect(trailXPos, mouseY+50, 100,100);
    nyanTrail.show();
    nyanTrail.update();
    nyanTrail.add(trailXPos, trailYPos);
    // image(nyancat, docWidth/2, mouseY);
    nyancat.position(docWidth/2, mouseY);
}

function mousePressed() {
    if (!nyanMusic.isPlaying())
        nyanMusic.loop();
}