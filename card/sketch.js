let noiseX;
let noiseY;
let noiseParam = 0;
let noiseStep = 0.1;

let W = 500;
let H = 200;
let margin = 10;
let C = 1;

let grid;

function make_grid(w, h, d){
  let array = [];
  for (let i = 0; i < w; i++){
    for (let j = 0; j < h; j++){
      array.push(true);
    }
  }

  let g = {
    initial_array: array.slice(),
    array: array,
    width: w,
    height: h,
    cell_size: d,
    draw: draw_grid,
    flip_pixel: grid_flip_pixel,
    reset: reset_grid,
  }

  return g;
}

function reset_grid(){
  this.array = this.initial_array.slice();
}

function draw_grid(){

  fill('white')
  noStroke();
  for (let i = 0; i < this.width; i++){
    for (let j = 0; j < this.height; j++){
      if (this.array[i + j * this.width]){
        rect(i * this.cell_size, j * this.cell_size, 0.8 * this.cell_size);
      }
    }
  }
}

function grid_flip_pixel(x, y, from_original = false){
  let i = x + y * W;

  let array_to_use = from_original ? this.initial_array : this.array;
  if (0 <= i && i < this.array.length){
    this.array[i] = !array_to_use[i];
  }
}

function setup() {
  createCanvas(1.2 * W, 1.2 * H);
  angleMode(DEGREES);
  rectMode(CENTER);
  textFont('monospace');
  frameRate(60);

  noiseX = random(1000);
  noiseY = random(1000);

  grid = make_grid(W, H, 10);

}

function draw() {

  rectMode(CENTER);
  background(255 * int(!C));

  stroke('white');
  noFill();

  grid.reset();
  removeCrossSection(width/2, height/2, W, H, noiseParam, grid.cell_size, C)
  grid.draw()
  // drawCard(width/2, height/2, W, H, margin, C);

  noiseParam += noiseStep;

}

function drawCard(x, y, w, h, margin, c) {

  stroke(255*c);
//   rect(x, y, w + 2*margin, h + 2*margin);
  // pixelCurve(x, y, w, h, noiseParam, 5, c);

  


  // fill('black');
  // noStroke();
  // textSize(110);
  // textAlign(CENTER, CENTER);
  // textFont('Pixelify Sans');
  // text('yon maor', width/2, height/2);

}

function pixelCurve(x, y, w, h, noiseParam, d, c){
  draw_grid(x, y, w, h, d, c);
  // removeCrossSection(x, y, w, h, noiseParam, d, c);
}

function removeCrossSection(sx, sy, w, h, noiseZ, d, c){

  // erase(0, 80);
  push();
  translate(sx - w/2, sy - h/2);

  for (let k = 0; k < 1000; k++) {

      let p = noiseZ;

      let x = map(noise(noiseX, k * 0.005, p * 0.011), 0, 1, -w * 0.75, w * 1.75);
      let y = map(noise(noiseY, k * 0.005, p * 0.0113), 0, 1, -h * 0.75, h * 1.75);
      
      // x = constrain(x, 0, width);
      // y = constrain(y, 0, height);

      x = floor(x / d);
      y = floor(y / d);

      if (0 <= x*d && x*d <= w && 0 <= y*d && y*d <= h){
        // fill(255 * int(!c));
        // stroke(255 * int(!c));

        grid.flip_pixel(x, y);
      }

      // stroke('white');
      // draw_x(x * W, y * W, W-4);
    
  }

  pop();
  
  // noErase();
}

function _draw_grid(sx, sy, w, h, d, c) {
  push();
  translate(sx - w/2, sy - h/2);

  noFill();
  stroke(255 * c);
  for (let i = 0; i <= w/d; i++){
    for (let j = 0; j <= h/d; j++){
      rect(i * d, j * d, d - 4);
    }
  }

  pop();
}

function draw_x(x, y, w){
  push();
  translate(x - w/2, y - w/2);
  line(0, 0, w, w);
  line(0, w, w, 0);
  pop();
}