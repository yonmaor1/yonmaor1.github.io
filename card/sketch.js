let noiseX;
let noiseY;
let noiseParam = 0;
let noiseStep = 0.1;

let W = 505;
let H = 205;
let margin = 5;
let C = 1;
let D = 5

let cardX, cardY;
let holdX, holdY;
let mouseX_hold, mouseY_hold;
let dragging = false;
let justSwitched = false;

let inCorner = false;
let corner = -1;

let cnv;

function isMobileView() {
  return window.innerWidth <= 768;
}
let isMobile = isMobileView();

window.addEventListener('resize', () => {
  isMobile = isMobileView();
});

document.addEventListener('darkModeEnabled', (event) => {
  console.log('Dark mode enabled:', event.detail.enabled);

  if (event.detail.enabled) {
    C = 0;
  }
});

document.addEventListener('darkModeDisabled', (event) => {
  console.log('Dark mode disabled:', event.detail.enabled);

  if (event.detail.enabled) {
    C = 1;  
  }
});

function setup() {
  if (isMobile){
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('mobile-landing');
    
    let d_approx = 7
    let N = floor(width / d_approx);
    D = width / N;
  } else {
    cnv = createCanvas(W, H);
    cnv.parent('draggable-rectangle');
  }


  angleMode(DEGREES);
  rectMode(CENTER);
  textFont('monospace');
  frameRate(60);

  noiseX = random(1000);
  noiseY = random(1000);

  cardX = width/2;
  cardY = height/2;

}

function draw() {

  rectMode(CENTER);
  background(255 * int(!C));

  stroke('white');
  noFill();

  drawCard(0 + width/2, 0 + height/2, width, height, margin, D, C);

}

function drawCard(x, y, w, h, margin, d, c) {

  // let d = 5


  let use_c = c;
  if (isMobile) {
    margin = d/2
    use_c = int(!c)
  } else {
    strokeWeight(2);
    stroke(255*c);
    rect(x, y, w, h);
    margin = d
  }
  pixelCurve(x, y, w - 2*margin, h - 2*margin, noiseParam, d, use_c);

  noiseParam += noiseStep;


  // fill(255*(1-c));
  // noStroke();
  // textSize(100);
  // textAlign(CENTER, CENTER)
  // text('yon maor', width/2, height/2)

  if (!isMobile) {
    push()
    translate(d, height/4)
    let name = 'yon maor';
    let curr_x = 0
    for (let i = 0; i < name.length; i++){
      let letter = name[i];
      if (letter == ' '){
        curr_x += 10*d;
        continue;
      }
      let pixel_letter = pixel_font[letter];
      let letter_width = pixel_letter.width;

      for (let j = 0; j < pixel_letter.array.length; j++){
        if (pixel_letter.array[j]){
          let pixel_x = j % 15;
          let pixel_y = floor(j / 15);

          fill(255 * int(!c));
          stroke(255 * int(!c));
          rect(curr_x + pixel_x * d, pixel_y * d, d);
        }
      }
      curr_x += letter_width*d + 2*d;

    }
    pop()
  }

  // textSize(30)
  // text('art | engineering | propaganda', width/2, height/2 + 40)

}

function pixelCurve(x, y, w, h, noiseParam, d, c){
  draw_grid(x, y, w, h, d, c);
  removeCrossSection(x, y, w, h, noiseParam, d, c);
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
        fill(255 * int(!c));
        stroke(255 * int(!c));
        rect(x * d, y * d, d);
      }

      // stroke('white');
      // draw_x(x * W, y * W, W-4);
    
  }

  pop();
  
  // noErase();
}

function draw_grid(sx, sy, w, h, d, c) {
  push();
  translate(sx - w/2, sy - h/2);

  if (isMobile) {
    fill(255 * c);
    noStroke();
  } else {
    noFill();
    strokeWeight(1);
    stroke(255 * c);

  }
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
