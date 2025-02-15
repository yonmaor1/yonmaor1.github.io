// 15 x 20
let pixels = []
let pixels_just_changed = []
let pixel_size = 10
let letter = 'y'

function setup() {
    createCanvas(15 * pixel_size, 20 * pixel_size);
    for (let i = 0; i < 15 * 20; i++) {
        pixels.push(false)
        pixels_just_changed.push(false)
    }
}


function draw() {

    background('black')

    push()
    fill('red');
    noStroke();
    textSize(10 * 2 * pixel_size);
    textAlign(LEFT, TOP);
    textFont('Pixelify Sans');
    text(letter, 0, 0);
    pop()


    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 20; j++) {
            let x = i * pixel_size
            let y = j * pixel_size
            let index = i + j * 15
            if (pixels[index]) {
                fill(0, 100) // black
            } else {
                fill(255, 100) // white
            }
            rect(x, y, 0.8 * pixel_size, 0.8 * pixel_size)
        }
    }

    if (mouseIsPressed && isMouseInCanvas()) {
        let x = floor(mouseX / pixel_size)
        let y = floor(mouseY / pixel_size)
        let index = x + y * 15
        if (!pixels_just_changed[index]) {
            pixels_just_changed[index] = true
            pixels[index] = !pixels[index]
        }

    }
}

function isMouseInCanvas() {
    return 0 <= mouseX && mouseX <= width && 0 <= mouseY && mouseY <= height
}

function mouseReleased() {
    for (let i = 0; i < 15 * 20; i++) {
        pixels_just_changed[i] = false
    }
}

function getLetterWidth(pixels) {
    let width = 0
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 20; j++) {
            let index = i + j * 15
            if (pixels[index]) {
                width = max(width, i)
            }
        }
    }
    return width
}

function keyPressed() {
    print(letter)
    print(pixels)
    print(getLetterWidth(pixels))

    navigator.clipboard.writeText(pixels);

    letter = key

    for (let i = 0; i < 15 * 20; i++) {
        pixels[i] = false
    }
}