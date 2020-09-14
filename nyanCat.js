let docWidth, docHeight;
let canvas, nyanCanvas, bgCanvas;

let nyanMusic, nyanImg, rainbowImg, earth; // for preloading

let nyanCat; // nyan cat size: W:264 H:168 Gap:56
let smallNyanCats, vNyanCats, hNyanCats; // arrays for nyan cats
let vDir, hDir; // keep track of vertical and horizontal nyan cats direction

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
    // load images
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

    // set globals
    docWidth = document.documentElement.clientWidth;
    docHeight = document.documentElement.clientHeight;
    vDir = 1;
    hDir = 1;
    smallNyanCats = [];
    hNyanCats = [];
    vNyanCats = [];
}

function setup() {
    canvas = createCanvas(docWidth, docHeight, WEBGL); // WEBGL canvas
    nyanCanvas = createGraphics(docWidth, docHeight); // 2D canvas for model
    bgCanvas = createGraphics(docWidth, docHeight); // canvas for trail
    frameRate(60);

    nyanCat = new NyanCat(docWidth/2, docHeight/2, undefined, undefined, undefined, 10);
    vNyanCats.push(new SmallNyanCat(getRand(1, docWidth), 0, 0, 1, 0),
                   new SmallNyanCat(getRand(1, docWidth), docHeight, 0, -1,0));
    hNyanCats.push(new SmallNyanCat(0, getRand(1, docHeight), 1, 0, undefined, 0),
                   new SmallNyanCat(0, getRand(1, docHeight), 1, 0, undefined, 0));
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

    // display and update nyan cats locations
    smallNyanCats.forEach((cat, i) => {
        cat.move();
        cat.show();
        // remove out of bounds nyan cats
        if (cat.coords.x > docWidth || cat.coords.x < 0 ||
            cat.coords.y > docHeight || cat.coords.y < 0) {
                smallNyanCats.splice(i, 1);
        }
    })

    vNyanCats.forEach((cat, i) => {
        cat.move();
        cat.show();
        // remove out of bounds nyan cats
        if (cat.coords.x > docWidth || cat.coords.x < 0 ||
            cat.coords.y > docHeight || cat.coords.y < 0) {
                vNyanCats.splice(i, 1);
        }
    });

    hNyanCats.forEach((cat, i) => {
        cat.move();
        cat.show();
        // remove out of bounds nyan cats
        if (cat.coords.x > docWidth || cat.coords.x < 0 ||
            cat.coords.y > docHeight || cat.coords.y < 0) {
                hNyanCats.splice(i, 1);
        }
    });

    if (vNyanCats.length < 2) {
        vDir *= -1;
        let y = vDir === 1 ? 0 : docHeight;
        vNyanCats.push(new SmallNyanCat(getRand(1, docWidth), y, 0, vDir, 0, Math.floor(Math.random()*10+1)));
    }

    if (hNyanCats.length < 2) {
        hDir *= -1;
        let x = hDir === 1 ? 0 : docWidth;
        hNyanCats.push(new SmallNyanCat(x, getRand(1, docHeight), hDir, 0,  Math.floor(Math.random()*10+1), 0));
    }
}

function getRand(min, max) {
    if (min === max) return min;
    return Math.floor(Math.random() * (max - min + 1) + min);
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