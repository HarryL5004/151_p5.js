let docWidth = document.documentElement.clientWidth;
let docHeight = document.documentElement.clientHeight;
let canvas;
let nyanCanvas;
let bgCanvas;

// let nyanCat;
let nyanMusic;
// let nyanCatSize = [264, 168, 56]; // w,h,pixels to tart
let nyanCats = [];
let rainbowImg;
let nyanImg;
let earth;

// class Rainbow {
//     constructor(x, y, width, height) {
//         this.rows = [];
//         this.numRect = 6;
//         this.color = [[231, 8, 15], [231, 145, 15], 
//                       [231, 237, 15], [47, 237, 15], 
//                       [2, 145, 244], [93, 54, 244]];
//         for(let i = 1; i < this.numRect+1; i++) {
//             // this.rows.push([x, y+Rainbow.height*i, Rainbow.width, Rainbow.height]);
//             this.rows.push([x, y+height*i, width, height]);
//         }
//     }

//     show() {
//         for(let i = 0; i < this.numRect; i++) {
//             fill(...this.color[i]);
//             rect(this.rows[i][0]-docWidth/2, 
//                  this.rows[i][1]-docHeight/2,
//                  this.rows[i][2], 
//                  this.rows[i][3]);
//         }
//     }

//     update(speed) {     
//         this.rows.forEach(row => {
//             row[0] -= speed;
//         }); 
//     }
    
//     get x() {
//         return this.rows[0][0];
//     }
// }

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
    constructor(x, y, xDir, yDir) {
        this.coords = {x,y};
        this.dimension = {w: 33, h: 20, g:7};
        this.speed = createVector(4,5);
        this.direction = createVector(xDir,yDir);
    }

    move(vect) {
        this.coords.x += this.speed.x*this.direction.x;
        this.coords.y += this.speed.y*this.direction.y;
        if (this.coords.x+this.dimension.w > docWidth || this.coords.x < 0) {
            this.direction.x = -this.direction.x;
        }
        if (this.coords.y+this.dimension.h > docHeight || this.coords.y < 0) {
            this.direction.y = -this.direction.y;
        }
        this.trailing();
    }

    trailing() {
        let radius = 14;
        let trailXPos = this.coords.x+this.dimension.w/2;
        let trailYPos = this.coords.y+this.dimension.h/2-radius/2;
        bgCanvas.fill(Math.random()*100 % 255,Math.random()*100 % 255,Math.random()*100 % 255);
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

    nyanCats.push(new NyanCat(docWidth/2, docHeight/2, undefined, undefined, undefined, 10));
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

    // display and update nyancats location
    for (let cat of nyanCats) {
        cat.move(createVector(mouseX, mouseY));
        cat.show();
    }
}

function getRand() {
    return Math.random() < 0.5 ? -1 : 1;
}

function mousePressed() {
    nyanCats.push(new SmallNyanCat(mouseX, mouseY,getRand(),getRand()));
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
    return false;
}