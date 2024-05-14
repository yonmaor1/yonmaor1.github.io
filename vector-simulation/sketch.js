let x, y;

let px = []
let py = []

let conv = 10;

let g = 5;
let vg = 0;

let r = 50;

function setup() {
    createCanvas(600, 600);
    rectMode(CENTER);

    x = width/2;
    y = height/2;

}

function arrow(x0, y0, x1, y1){
    line(x0, y0, x1, y1);

    push();
    translate(x1, y1);
    rotate(Math.atan2(y1-y0, x1-x0));

    if (abs(y1 - y0) > 2 || abs(x1 - x0) > 2){
        line(0, 0, -5, -5)
        line(0, 0, -5, 5)
    }
    pop();
}

function avg(a){
    let s = 0;
    for (let i = 0; i < a.length; i++){
        s += a[i]
    }

    return s / a.length
}

function draw() {

    background('white');
    strokeWeight(1)
    stroke('black')
    rect(width/2, height/2, 400, 400)

    px.push(x);
    py.push(y);

    if (px.length > conv) {
        px.shift()
        py.shift()
    }

    if (mouseIsPressed){
        x = mouseX
        y = mouseY
        vg = 0;
    } else {
        y += vg;
        vg += g;
    }
    
    x = constrain(x, 100+r/2, width-100-r/2);
    y = constrain(y, 100+r/2, height-100-r/2);

    vx = 5*(x - avg(px));
    vy = 5*(y - avg(py));

    if (mouseIsPressed){
        fx = constrain(mouseX, 0, width) - x;
        fy = constrain(mouseY, 0, height) - y;
    } else {
        fx = 0;
        fy = 7 * g;
    }
    

    
    rect(x, y, r);

    strokeWeight(2)
    
    if (mouseIsPressed){
        arrow(x, y, x + vx, y);
        arrow(x, y, x, y + vy);

        stroke('red')
        arrow(x, y, x + vx, y + vy);
        
    }
    
    stroke('red')
    arrow(x, y, x + fx, y + fy);

    stroke('green')
    if (mouseIsPressed || 
        (abs(vy) < 1 && abs(vx) < 1)){
        arrow(x, y, x - fx, y - fy);
    }
    

}

