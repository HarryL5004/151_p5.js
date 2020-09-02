let docWidth = document.documentElement.clientWidth;
let docHeight = document.documentElement.clientHeight;
let canvas;

let nyanCat;
let nyanMusic;
let nyanCatSize = [264, 160];
let nyanTrail;
let trailXPos = docWidth/2-130;

class Trail {
    constructor() {
        this.trail = [];
        this.width = 200;
        this.height = 100;
        this.speed = 30;
    }

    add(vect) {
        this.trail.push(vect);
    }

    show() {
        for (let vect of this.trail) {
            rect(vect.x, vect.y, this.width, this.height);
        }
    }

    update() {
        this.trail.forEach(vect => {        
            vect.x -= this.speed;
        })
        this.removeOB();
    }

    removeOB() {
        if (this.trail.length && this.trail[0].x < -this.width) {
            this.trail.shift();
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
    nyanCat = createImg('assets/nyanCat.gif', "nyan cat", "anonymous", e => {
        e.hide();
    });
    soundFormats('ogg', 'mp3');
    nyanMusic = loadSound('assets/nyanCat');
}

function draw() {
    background(53, 87, 140);    
    nyanCat.show()
    let nyancatY = mouseY < docHeight-nyanCatSize[1] ? mouseY : docHeight-nyanCatSize[1];
    nyanCat.position(docWidth/2, nyancatY);

    fill(242,245,56);
    let trailYPos = nyancatY+50;
    let vect = createVector(trailXPos, trailYPos);
    nyanTrail.add(vect);
    nyanTrail.show();
    nyanTrail.update();
}

function mousePressed() {
    if (!nyanMusic.isPlaying()) {
        nyanMusic.setVolume(0.2);
        nyanMusic.loop();
    }
}