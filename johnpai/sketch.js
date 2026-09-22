WIDTH = 400;
HEIGHT = 400;
let cnv;

let iteration_index = 0;
let iterations = ['base', 'function', 'drawing']
let iteration_configs = {
  'base': {
    n_planes: 5,
    n_divs: 7,
    plane_width: 100,
    object_height_coeff: 0.6/4,
    plane_dist: 120,
    scale_factor: 0.5
  },
  'function': {
    n_planes: 2,
    n_divs: 10,
    plane_width: 100,
    object_height_coeff: 0.6/4,
    plane_dist: 120,
    scale_factor: 1
  },
  'drawing': {
    n_planes: 0,
    n_divs: 7,
    plane_width: 100,
    object_height_coeff: 0.6/4,
    plane_dist: 120,
    scale_factor: 0.5
  }
}

let configs = iteration_configs[iterations[iteration_index]]
let base_configs = iteration_configs['base']
let planes = [];
let object_height;
let curve_stregth;

let bg_x = 100;
let bg_y = -200;

let editing_plane = false;
let rotating_plane = false;
let editing_plane_index = -1;

let plane_rotate_initial_mouse_x = 0
let plane_rotate_initial_mouse_y = 0

function nextIteration() {
  iteration_index = (iteration_index + 1) % iterations.length
  configs = iteration_configs[iterations[iteration_index]]
  setupConfigs()
}

function prevIteration() {
  iteration_index = (iteration_index - 1 + iterations.length) % iterations.length
  configs = iteration_configs[iterations[iteration_index]]
  setupConfigs()
}

function toAlpha(num) {
  let alpha_str = ""
  for (let i = 0; i < floor(num/26); i++) {
    alpha_str += 'Z'
  }
  alpha_str += String.fromCharCode(65 + num%26)
  return alpha_str
}

function addPlane(x=0, y=0, z=0, init_angle_x=0, init_angle_y=0, init_angle_z=0, fixed=false) {
  let plane = createPlane(x, y, z, init_angle_x, init_angle_y, init_angle_z, fixed)
  planes.push(plane)

  editing_plane = true
  editing_plane_index = planes.length - 1
}

function stopEditingNewestPlane() {
  editing_plane = false
  rotating_plane = false
  editing_plane_index = -1
}

function keyPressed() {
  print(key)
  switch (key) {
    case '~':
      saveGif('johnpai.gif', 6)
      // saveFrames(frameCount, 'png', 15, 22)
    case 'Enter':
      stopEditingNewestPlane()

  }
}

function setupConfigs() {
  console.log("Current iteration: " + iterations[iteration_index])
  console.log(configs)
  
  planes = [];
  object_height = configs.plane_dist * (configs.n_planes-1);
  curve_stregth = object_height / (3*configs.n_planes)
  if (iterations[iteration_index] == 'drawing'){
    object_height = configs.plane_dist * (base_configs.n_planes-1);
    curve_stregth = object_height / (3*base_configs.n_planes)
  }
  for (let i = 0; i < configs.n_planes; i++){
    // original
    y = map(i, 0, configs.n_planes-1, -object_height/2, object_height/2)
    is_fixed = i == 0 || i == configs.n_planes - 1 ? true : false
    if (iterations[iteration_index] == 'function'){
      is_fixed = false
    } else if (iterations[iteration_index] == 'drawing'){
      is_fixed = true
    }
    addPlane(0, y, 0, 90, 0, 0, is_fixed)
    
    // circle
    // theta = map(i, 0, n_planes, 0, 360)
    // r = object_height / 2
    // is_fixed = i == 0 || i == n_planes - 1 ? true : false
    // planes[i] = createPlane(
    //   r*cos(theta), r*sin(theta), 0, 
    //   90, theta, 0,
    //   is_fixed)
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height){
    return
  }

  if (iterations[iteration_index] != 'drawing'){
    return
  }

  if (!editing_plane) {
    console.log("Adding plane at mouse position: " + mouseX + ", " + mouseY)
    world_coords = screenToWorld(mouseX, mouseY, 0)

    print("Adding plane at " + mouseX + ", " + mouseY)
    print("World coordinates: " + world_coords.x + ", " + world_coords.y + ", " + world_coords.z)
    addPlane(20 * world_coords.x, 20 * world_coords.y, 0, 90, 0, 0, false)
   
  } else {
    console.log("Starting to rotate plane " + editing_plane_index)
  }
  
  plane_rotate_initial_mouse_x = mouseX
  plane_rotate_initial_mouse_y = mouseY

  plane_rotate_initial_angle_x = planes[editing_plane_index].init_angle_x
  plane_rotate_initial_angle_y = planes[editing_plane_index].init_angle_y
  plane_rotate_initial_angle_z = planes[editing_plane_index].init_angle_z

  rotating_plane = true

}

function mouseDragged() {

  if (iterations[iteration_index] != 'drawing'){
    return
  }
  
  console.log("Rotating plane " + editing_plane_index)
  
  dx = mouseX - plane_rotate_initial_mouse_x
  dy = mouseY - plane_rotate_initial_mouse_y

  if (keyIsPressed) {
    console.log("Scaling plane " + editing_plane_index + " by dx: " + dx)
    scale_factor = map(dx, -height/2, height/2, 0.1, 2)
    let plane = planes[editing_plane_index]
    plane.scale_factor = scale_factor
  } else {
    angle_z = plane_rotate_initial_angle_x + map(dx, 0, width, -180, 180)
    angle_y = plane_rotate_initial_angle_y + map(dy, 0, height, -180, 180)

    if (editing_plane && rotating_plane && editing_plane_index >= 0 && editing_plane_index < planes.length) {
      console.log("Rotating plane " + editing_plane_index + " by dx: " + angle_z + ", dy: " + angle_y)
      let plane = planes[editing_plane_index]
      plane.init_angle_z = angle_z
      plane.init_angle_y = angle_y
    }
  }
}

function mouseReleased() {
  rotating_plane = false
}

function setup() {
  cnv = createCanvas(WIDTH, HEIGHT, WEBGL)
  cnv.parent('canvas-container')
  frameRate(24)
  // debugMode();
  // noLoop()
  angleMode(DEGREES)

  noFill()
  strokeWeight(0.5)

  setupConfigs()
}

function eval_fn(f_str) {
  fn = eval(`(t,i,x,y)=>${f_str}`)
  out = fn(0, 0, 0, 0) // test the function
  if (typeof out !== 'number' || isNaN(out)) {
    throw new Error('Function does not return a number');
  }
  return fn
}

let x_fn = eval_fn("x")
let y_fn = eval_fn("y")

document.addEventListener('DOMContentLoaded', function() {
  x_input = document.getElementById('x-input')
  x_input.addEventListener('input', function() {
    console.log("x function updated")
    let x_fn_str = x_input.value;
    try {
      x_fn = eval_fn(x_fn_str)
      print(x_fn)
    } catch (e) {
      print(e)
    }
  });

  y_input = document.getElementById('y-input')
  y_input.addEventListener('input', function() {
    console.log("y function updated")
    let y_fn_str = y_input.value;
    try {
      y_fn = eval_fn(y_fn_str)
      print(y_fn)
    } catch (e) {
      print(e)
    }
  });

  prev_btn = document.getElementById('prev-btn')
  next_btn = document.getElementById('next-btn')
  prev_btn.addEventListener('click', function() {
    console.log("prev button clicked")
    prevIteration()
  });
  next_btn.addEventListener('click', function() {
    console.log("next button clicked")
    nextIteration()
  });
});

function draw() {
  background('white')
  // orbitControl();
  
  scale(configs.scale_factor, configs.scale_factor)
  push()
  rotateY(30)
  for (let i = 0; i < planes.length; i++){
    // debug
    // push()
    // stroke(0, 100)
    // translate(planes[i].init_x + planes[i].x, planes[i].init_y + planes[i].y, 0)
    // plane()
    // pop()
    
    planes[i].move()
    planes[i].draw()
    // planes[i]._drawAbsoluteSubdivs()
  }
  pop()

  resetMatrix();
  // lightsource_bg()
  push()
  stroke(0, 255)
  rect(-width/2+1, -height/2+1, width-1, height-2)
  translate(-width/2, -height/2)
  // translate(-(object_height*0.3125), -(object_height*0.125))
  // circle(0, 0, object_height*0.625)
  for (let p = 0; p < planes.length; p++){
    // console.log("Drawing connections for plane " + p)
    let curr_plane = planes[p]
    for (let i = 0; i < curr_plane.points.length; i++) {
      // print("Drawing connections for row " + i + " of plane " + p)
      let curr_row = curr_plane.points[i]
      stroke(0, 100)
      if (iterations[iteration_index] == 'drawing' && p == editing_plane_index){
        stroke(255, 0, 0, 100)
      }
      line(
        curr_row[0].x, curr_row[0].y,
        curr_row[(curr_row.length)-1].x, curr_row[(curr_row.length)-1].y,
      )
      line(
        curr_plane.points[0][i].x, curr_plane.points[0][i].y,
        curr_plane.points[(curr_row.length)-1][i].x, curr_plane.points[(curr_row.length)-1][i].y,
      )
      if (p < planes.length-1){
        var next_plane = p < planes.length-1 ? planes[p+1] : planes[0]
  
        let curr_control = curr_plane.controls_pre[i]
        stroke(0, 255)
        for (let j = 0; j < curr_row.length; j++) {
          index = j + i * curr_row.length
          next_x = floor(x_fn(frameCount, index, i, j)) % curr_row.length
          next_y = floor(y_fn(frameCount, index, i, j)) % curr_row.length
          
          let next_row = next_plane.points[next_x]
          let next_control = next_plane.controls_post[next_x]
          bezier(
            curr_row[j].x, curr_row[j].y,
            curr_control[j].x, curr_control[j].y,
            next_control[next_y].x, next_control[next_y].y,
            next_row[next_y].x, next_row[next_y].y
          )
  
          // line(
          //   curr_row[j].x, curr_row[j].y,
          //   curr_control[j].x, curr_control[j].y
          // )
          // line(
          //   next_control[j].x, next_control[j].y,
          //   next_row[j].x, next_row[j].y
          // )
      }
      }
    }
  }
  pop()
  // if (frameCount < 60 * 24){
  //   print("Saving frame " + toAlpha(frameCount))
  //   saveCanvas(toAlpha(frameCount), 'png')
  // } else {
  //   noLoop()
  // }
}

function lightsource_bg() {
  push()
  for (let i = 0; i < width; i++) {
    a = map(i, 0, width, 255, 0);
    stroke(255, 250, 150, a)
    ellipse(bg_x, bg_y, i, i)
  }
  pop()
}

/**  */

function createPlane(x, y, z, init_angle_x, init_angle_y, init_angle_z, fixed) {
  p = {
    init_x: x, init_y: y, init_z: z,
    x: 0, y: 0, z: 0,
    angle_x: 0, angle_y: 0, angle_z: 0,
    init_angle_x: init_angle_x, init_angle_y: init_angle_y, init_angle_z: init_angle_z,
    fixed: fixed, noise_param: random(10000), scale_factor: 1,
    points: [], controls_pre: [], controls_post: [],
    draw: drawPlane,
    move: movePlane,
    _drawAbsoluteSubdivs: _drawAbsoluteSubdivs
  }
  return p
}

function drawPlane() {
  stroke('red')
  // plane(plane_width, plane_width)
  push()
  translate(this.init_x + this.x, this.init_y + this.y, this.init_z + this.z)
  rotateX(this.init_angle_x + this.angle_x)
  rotateY(this.init_angle_y + this.angle_y)
  rotateZ(this.init_angle_z + this.angle_z)
  for (let i = 0; i < configs.n_divs+1; i ++) {
    this.points[i] = []
    this.controls_pre[i] = []
    this.controls_post[i] = []
    inter_div_width = this.scale_factor * configs.plane_width / configs.n_divs
    lower_bound = -this.scale_factor * configs.plane_width/2
    upper_bound = this.scale_factor * configs.plane_width/2
    x = map(i, 0, configs.n_divs, lower_bound, upper_bound) + (noise(this.noise_param + i/10) - 0.5) * inter_div_width
    for (let j = 0; j < configs.n_divs+1; j ++) {
      y = map(j, 0, configs.n_divs, lower_bound, upper_bound) + (noise(this.noise_param + i/10) - 0.5) * inter_div_width

      if (i < configs.n_divs && j < configs.n_divs){
        // rect(x, y, plane_width/n_divs, plane_width/n_divs)
      }
      this.points[i][j] = worldToScreen(x, y, 0);
      this.controls_pre[i][j] = worldToScreen(x, y, -curve_stregth)
      this.controls_post[i][j] = worldToScreen(x, y, curve_stregth)
    }
  }
  pop()
}

let angle_range = 60;
let move_range = configs.plane_width / 2;
function movePlane() {
  if (this.fixed){
    return
  }

  this.angle_x = angle_range*(noise(this.noise_param) - 0.5)
  this.angle_y = angle_range*(noise(this.noise_param + 100) - 0.5)
  this.angle_z = angle_range*(noise(this.noise_param + 200) - 0.5)
  
  this.x = move_range*(noise(this.noise_param + 300) - 0.5)
  this.z = move_range*(noise(this.noise_param + 400) - 0.5)
  this.noise_param += 0.005
}

function _drawAbsoluteSubdivs() {
  push()
  stroke('red')
  for (let i = 0; i < this.points.length; i++) {
    row = this.points[i]
    for (let j = 0; j < row.length; j++) {
      point(row[j].x, row[j].y)
    }
  }
  pop()
}