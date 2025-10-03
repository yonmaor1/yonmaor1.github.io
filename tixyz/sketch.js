let num_blocks = 10;
let block_size = 25;

let prev_f_str = '0';
let f_str = '0';
let f = () => 0;
let frames_since = 0;

let pixs = new Array(num_blocks ** 3).fill(0);

let cnv;
let cam;

function setup() {
  cnv = createCanvas(500, 500, WEBGL);
  cnv.parent('canvas')
  // cam = createCamera();
  // cam.setPosition(0, 0, (num_blocks * block_size) / (2 * tan(PI * 30.0 / 180.0)));
  camera(260, -171, 300, 0, 0, 0, 0, 1, 0);

  frameRate(15);
}

function draw() {
  background(0);
  rotateOnlyControl();

  func_input();
  draw_grid(f)

  frames_since += 1;
}

/**
 * @brief check if the provided string is a valid function
 * 
 * @param {string} f_str string to check
 * 
 * @returns {boolean} true if the provided string is a valid function
 */
function is_valid_function(f_str) {
    
  if (!f_str) {
      return false;
  }

  try {
      // try to create a new function with the provided string
      let test_f = new Function(`return (x, y, z, i, t, P) => ${f_str}`);
      let test_value = test_f()(0, 0, 0, 0, 0, pixs);

      if (typeof test_value != 'number' && typeof test_value != 'boolean') {
          return false;
      }
      
      return true;
  } catch (e) {
      return false;
  }
}

/**
 * @brief eval the function from the input field
 */
function func_input() {

  let prev_f_str = f_str;
  f_str = document.getElementById('function-input').value;
  // f_str = parse_function(f_str);

  if (f_str == prev_f_str) {
      return;
  }
  if (is_valid_function(f_str)) {
      try {
          f = eval(`(x, y, z, i, t, P) => Number(${f_str})`);
          frames_since = 0;
          for (let i = 0; i < num_blocks ** 3; i++) {
              pixs[i] = 0;
          }
      } catch (e) { // probably in the middle of typing
          try {
              f = eval(`(x, y, z, i, t, P) => Number(${prev_f_str})`);
              f_str = prev_f_str;
              for (let i = 0; i < num_blocks ** 3; i++) {
                  pixs[i] = 0;
              }
          } catch (e) { // something went wrong
              f = () => 0; // fallback to a default function
              f_str = '0';
          }
      }
  } else {
      f = eval(`(x, y, z, i, t, P) => Number(${prev_f_str})`);
      f_str = prev_f_str;
      for (let i = 0; i < num_blocks ** 3; i++) {
          pixs[i] = 0;
      }
  }

}

function test_f(x, y, z, i, t, P) {
  return 2 * (noise(x * 0.1, y * 0.1, z * 0.1 + t * 0.1) - 0.5);
}

function draw_grid(f){

  let index = 0
  translate(-block_size * num_blocks / 2, -block_size * num_blocks / 2, -block_size * num_blocks / 2);
  for (let i = 0; i < num_blocks; i++) {
    for (let j = 0; j < num_blocks; j++) {
      for (let k = 0; k < num_blocks; k++) {

        let val = f(i, j, k, index, frames_since, pixs);
        let size = map(abs(val), 0, 1, 0, 0.9 * block_size, true)
        let colr = val < 0 ? color(255, 0, 0, 100) : color(255, 255, 255, 100)
        push();
        translate(i * block_size, j * block_size, k * block_size);
        fill(colr)
        stroke(255, 30)
        box(size);

        // stroke(255, 30)
        // noFill()
        // box(0.9 * block_size);
        pop();

        index += 1;
      }
    }
  }
}

let val = 0;
p5.prototype.rotateOnlyControl = function(sensitivityX, sensitivityY, sensitivityZ) {
  //init 3d 
  this._assert3d('rotateOnlyControl');

  const cam = this._renderer._curCamera;
  //default zooms

  if (typeof sensitivityX === 'undefined') {
    sensitivityX = 1;
  }
  if (typeof sensitivityY === 'undefined') {
    sensitivityY = sensitivityX;
  }
  if (typeof sensitivityZ === 'undefined') {
    sensitivityZ = 0.5;
  }
  //zoom
  const scaleFactor = this.height < this.width ? this.height : this.width;
  this._renderer._curCamera._orbit(0, 0, val * scaleFactor);

  if (this.mouseIsPressed) {
    if (start_x > this.width || start_y > this.height || 
      start_x < 0 || start_y < 0) {
        return;
    }
    // ORBIT BEHAVIOR
    if (this.mouseButton === this.LEFT) {
      const deltaTheta =
        -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
      const deltaPhi =
        sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;
      this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    } else if (this.mouseButton === this.RIGHT) {
      // PANNING BEHAVIOR along X/Z camera axes and restricted to X/Z plane
      // in world space
      const local = cam._getLocalAxes();

      // normalize portions along X/Z axes
      const xmag = Math.sqrt(local.x[0] * local.x[0] + local.x[2] * local.x[2]);
      if (xmag !== 0) {
        local.x[0] /= xmag;
        local.x[2] /= xmag;
      }

      // normalize portions along X/Z axes
      const ymag = Math.sqrt(local.y[0] * local.y[0] + local.y[2] * local.y[2]);
      if (ymag !== 0) {
        local.y[0] /= ymag;
        local.y[2] /= ymag;
      }

      // move along those vectors by amount controlled by mouseX, pmouseY
      const dx = -1 * sensitivityX * (this.mouseX - this.pmouseX);
      const dz = -1 * sensitivityY * (this.mouseY - this.pmouseY);

      // restrict movement to XZ plane in world space
      cam.setPosition(
        cam.eyeX + dx * local.x[0] + dz * local.z[0],
        cam.eyeY,
        cam.eyeZ + dx * local.x[2] + dz * local.z[2]
      );
    }
  }
  return this;
};

function mousePressed() {
  start_x = mouseX;
  start_y = mouseY;
}

function mouseReleased() {
  start_x = null;
  start_y = null;
}