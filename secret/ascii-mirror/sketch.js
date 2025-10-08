let capture;
let step = 12;
// let symbols = " .,;=!*#&@";
let symbols = "  .:!i*w#&W0@"
// let symbols = "1234567890";
let draw_array = [];
let colors = [];
let capture_x = 800;
let capture_y = 500;
let draw_len = (capture_x * capture_y) / step;

document.getElementById("eval_ascii").addEventListener("click", function(event) {
  symbols = document.getElementById("ascii_input").value;
  console.log("Updated symbols to: " + symbols);
});

document.getElementById("export").addEventListener("click", function(event) {
  saveCanvas('ascii-mirror', 'png');
});

function setup() {
  createCanvas(capture_x, capture_y);
  capture = createCapture(VIDEO);
  capture.size(capture_x, capture_y);
  textSize(step);
  frameRate(15);
  capture.hide();

  // noLoop();
}

function draw() {
  background('black');
  image(capture, 0, 0, width, height);
  sampleFrame();
  background('black');
  drawFrame();
}


function sampleFrame() {

  for (let i = 0; i < draw_len; i++){
    x = (step * i) % capture_x;
    y = floor((step * i) / capture_x);
    let c = get(x,y);
    let gs = rgbToGs(c[0], c[1], c[2]);
    // print(gs);
    // print(c);
    print(symbols)
    let symbol_index = int(map(gs, 0, 255, symbols.length - 1, 0)) // unsafe array access
    // print(symbol_index);
    draw_array[i] = symbols[symbol_index];
    colors[i] = c;
  }


  // print(draw_array);
}

function rgbToGs(r, g, b){
  return int(0.2126*r + 0.7152*g + 0.0722*b);
}

function drawFrame(){
    for (let i = 0; i < draw_len; i++) {
        x = (i % width) * step;
        y = floor(i / width) * step;

        fill('white');
        text(draw_array[i], x, y);
    }
}