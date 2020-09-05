let docWidth = document.documentElement.clientWidth;
let docHeight = document.documentElement.clientHeight;
let canvas;

let nyanCat;
let nyanMusic;
let nyanCatSize = [264, 168, 56]; // w,h,pixels to tart

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
Rainbow.width = 100; //200
Rainbow.height = 84/6;  //100/6

class Trail {
    constructor() {
        this.history = [];
        this.speed = 20;
        this.direction = true;
    }

    add(vect) {
        // if (this.direction) {
        //     this.history.push(new Rainbow(vect.x, vect.y));
        // }
        // else {
        //     this.history.push(new Rainbow(vect.x, vect.y-Rainbow.height));
        // }
        this.history.push(new Rainbow(vect.x, vect.y));
        this.direction = !this.direction;
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

    get lastRainbowX() {
        if (!this.history.length)
            return 0
        return this.history[this.history.length-1].x
    }
}
let nyanTrail;

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
    let nyanCatX = mouseX-nyanCatSize[2]-nyanCatSize[0]/2;
    let nyanCatY = mouseY-nyanCatSize[1]/2;
    if (mouseY+nyanCatSize[1]/2 >= docHeight) {
        nyanCatY = docHeight-nyanCatSize[1];
    } else if (mouseY-nyanCatSize[1]/2 <= 0) {
        nyanCatY = 0;
    }
    nyanCat.position(nyanCatX, nyanCatY);

    if (nyanCatX+nyanCatSize[2] - nyanTrail.lastRainbowX >= Rainbow.width) {
        let trailXPos = nyanCatX+nyanCatSize[2];
        let trailYPos = nyanCatY+(nyanCatSize[1]/2)-(Rainbow.height*6/2);
        let vect = createVector(trailXPos, trailYPos);
        nyanTrail.add(vect);
    }
    nyanTrail.showNUpdate();
}

// function mousePressed() {
// }

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