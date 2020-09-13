let docWidth = document.documentElement.clientWidth;
let docHeight = document.documentElement.clientHeight;
let canvas;
let nyanCanvas;
let bgCanvas;

let nyanCat; // nyan cat size: W:264 H:168 Gap:56
let nyanMusic;
let smallNyanCats = [];
let rainbowImg;
let nyanImg;
let earth;

class Trail {
    constructor(limit = 10, rWidth, rHeight) {
        this.history = [];
        this.speed = rWidth;
        this.direction = true;
        this.limit = limit;
        this.rainbowDim = {w: rWidth, h: rHeight};
    }

    add(vect) {
        this.history.push(vect);
    }

    showNUpdate() {
        this.history.forEach(coords => {
            nyanCanvas.image(rainbowImg, coords.x, coords.y, this.rainbowDim.w, this.rainbowDim.h);
            coords.x-=this.speed;
        });
        this.remove();
    }

    remove() {
        if (this.history.length > this.limit) {
            this.history.shift();
        }
    }
}

class NyanCat {
    constructor(x, y, width=43, height=15, gap=7, trailCnt=-1, trailWidth=10, trailHeight=5) {
        this.coords = {x, y};
        this.dimension = {w: width, h: height};
        this.gap = gap;
        this.trail = new Trail(trailCnt, trailWidth, trailHeight);
    }

    move(vect) {
        this.coords.x = vect.x;
        this.coords.y = vect.y;
        this.trailing();
    }

    trailing() {
        // calculate x, y for the trail
        let trailXPos = this.coords.x;
        let trailYPos = this.coords.y+(this.dimension.h/2)-(this.trail.rainbowDim.h/2);
        this.trail.add(createVector(trailXPos, trailYPos)); // add coords for new trail
        this.trail.showNUpdate();
    }

    show() {
        nyanCanvas.image(nyanImg, this.coords.x, this.coords.y, this.dimension.w, this.dimension.h);
    }
}

class SmallNyanCat {
    constructor(x, y, xDir, yDir, xSpd=4, ySpd=5) {
        this.coords = {x,y};
        this.dimension = {w: 33, h: 20, g:7};
        this.speed = createVector(xSpd,ySpd);
        this.direction = createVector(xDir,yDir);
        this.colors = [color(231, 8, 15), color(231, 145, 15),
                      color(231, 237, 15), color(47, 237, 15), 
                      color(2, 145, 244), color(93, 54, 244)];
        this.currColor = 0;
    }

    move() {
        this.coords.x += this.speed.x*this.direction.x;
        this.coords.y += this.speed.y*this.direction.y;
        this.trailing();
    }

    trailing() {
        // determine trail size and position
        let radius = 14;
        let trailXPos = this.coords.x+this.dimension.w/2;
        let trailYPos = this.coords.y+this.dimension.h/2-radius/2;

        // determine trail color
        let color = this.currColor % 1 === 0 ? this.colors[this.currColor] : 
                    lerpColor(this.colors[this.currColor-0.5], this.colors[this.currColor+0.5], 0.5);
        this.currColor = this.currColor+0.5 > 5 ? 0 : this.currColor+0.5;

        bgCanvas.fill(color); // fill color
        bgCanvas.noStroke();
        bgCanvas.circle(trailXPos, trailYPos, radius);
    }

    show() {
        image(nyanImg, this.coords.x-docWidth/2, this.coords.y-docHeight/2, this.dimension.w, this.dimension.h);
    }
}

function preload() {
    nyanImg = loadImage("assets/nyancat.gif");
    rainbowImg = loadImage("assets/rainbow.png");

    // music
    soundFormats('ogg', 'mp3');
    nyanMusic = loadSound('assets/nyanCatshort');
    nyanMusic.onended(() => {
        if (!nyanMusic.isPaused())
            nyanMusic.play(undefined, undefined, undefined, 3.95);
    });
    nyanMusic.setVolume(0.4);

    // load model and img for Earth
    earth = {model: loadModel("assets/Earth2K.obj", true),
             img: loadImage("assets/Diffuse_2K.png")};
}

function setup() {
    canvas = createCanvas(docWidth, docHeight, WEBGL); // WEBGL canvas
    nyanCanvas = createGraphics(docWidth, docHeight); // 2D canvas for model
    bgCanvas = createGraphics(docWidth, docHeight); // canvas for trail
    frameRate(60);

    nyanCat = new NyanCat(docWidth/2, docHeight/2, undefined, undefined, undefined, 10);
}

function draw() {
    background(8, 20, 39); // redraw canvas
    
    // custom configurations for Earth model
    push();
    rotate(frameCount*0.015, [0,1,0]);
    scale(2.0);
    texture(nyanCanvas);
    noStroke();
    model(earth.model);
    pop();

    // redraw canvas on model
    nyanCanvas.background(earth.img);    
    // draw bgCanvas starting at the top left corner
    image(bgCanvas, -docWidth/2, -docHeight/2, docWidth, docHeight);

    nyanCat.move(createVector(mouseX, mouseY));
    nyanCat.show();

    // display and update nyancats location
    smallNyanCats.forEach((cat, i) => {
        cat.move();
        cat.show();
        // remove out of bounds nyan cats
        if (cat.coords.x > docWidth || cat.coords.x < 0 ||
            cat.coords.y > docHeight || cat.coords.y < 0) {
                smallNyanCats.splice(i, 1);
        }
    })
}

function getRand() {
    return Math.random() < 0.5 ? -1 : 1;
}

function mousePressed() {
    smallNyanCats.push(new SmallNyanCat(mouseX, mouseY, 1, 1),
                       new SmallNyanCat(mouseX, mouseY, -1, 1),
                       new SmallNyanCat(mouseX, mouseY, 1, -1),
                       new SmallNyanCat(mouseX, mouseY, -1, -1));
}

// event listener
function keyPressed() {
    if (key === 'p' && isLooping()) {
        noLoop();
    }        
    else if (key === 'p') {
        loop();
    }

    if (key === ' ' && nyanMusic.isPlaying())
        nyanMusic.pause();
    else if (key === ' ') {
        nyanMusic.play();
    }

    if (key === 'r') {
        bgCanvas.clear();
    }
    return false;
}