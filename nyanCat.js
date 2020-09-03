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
        this.history = [];
        this.speed = 30;
    }

    add(vect) {
        this.history.push(new Rainbow(vect.x, vect.y));
    }

    showNUpdate() {
        this.history.forEach(rainbow => {
            rainbow.show();
            rainbow.update(this.speed);
        });
        this.removeOB();
    }

    removeOB() {
        if (this.history.length && this.history[0].x < -Rainbow.width) {
            this.history.shift();
        }
    }
}

class Rainbow {

    constructor(x, y) {        
        this.rows = [];
        this.numRect = 6;
        this.color = [[231, 8, 15], [231, 145, 15], 
                      [231, 237, 15], [47, 237, 15], 
                      [2, 145, 244], [93, 54, 244]];
        for(let i = 1; i < this.numRect+1; i++) {
            this.rows.push([x, y+Rainbow.height*i, Rainbow.width, Rainbow.height]);
        }
    }

    show() {
        for(let i = 0; i < this.numRect; i++) {
            fill(...this.color[i]);
            rect(this.rows[i][0], 
                 this.rows[i][1], 
                 this.rows[i][2], 
                 this.rows[i][3]);
        }
    }

    update(speed) {     
        this.rows.forEach(row => {
            row[0] -= speed;
        }); 
    }
    
    get x() {
        return this.rows[0][0];
    }
}
Rainbow.width = 200;
Rainbow.height = 100/6; 

function preload() {    
    nyanCat = createImg('assets/nyanCat.gif', "nyan cat", "anonymous", elem => {
        elem.hide();
    });

    soundFormats('ogg', 'mp3');
    nyanMusic = loadSound('assets/nyanCatshort');
    // nyanMusic.setLoop(true);
    nyanMusic.onended(() => {
        if (!nyanMusic.isPaused())
            nyanMusic.play(undefined, undefined, undefined, 3.95);
    });
    nyanMusic.setVolume(0.4);
}

function setup() {
    canvas = createCanvas(docWidth, docHeight);
    background(53, 87, 140);
    frameRate(60);
    nyanTrail = new Trail();
}

function draw() {
    background(53, 87, 140);    
    nyanCat.show()
    let nyancatY = mouseY < docHeight-nyanCatSize[1] ? mouseY : docHeight-nyanCatSize[1];
    nyanCat.position(docWidth/2, nyancatY);

    let trailYPos = nyancatY-(Rainbow.height*6/2)+(nyanCatSize[1]/2);
    let vect = createVector(trailXPos, trailYPos);
    nyanTrail.add(vect);
    nyanTrail.showNUpdate();
}

// function mousePressed() {
// }

function keyPressed() {
    if (key === 'p' && isLooping())
        noLoop();
    else if (key === 'p')
        loop();

    if (key === ' ' && nyanMusic.isPlaying())
        nyanMusic.pause();
    else if (key === ' ') {
        nyanMusic.play();
    }
    return false;
}