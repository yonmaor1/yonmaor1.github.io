function makeImg(url, itext, iw, ih) {
    let img = {
        img: url, text: itext,
        w: iw, h: ih,
        mouseOver: false,
        clicked: false,
        draw: draw_image,
    }

    return img;
}

function draw_image() {

    if (this.img.height > this.img.width) {
        let ratio = this.img.height / this.img.width;
        image(this.img, 0, 0, this.w, ratio * this.w);
        fill('white');
        rect(0, this.h, this.w, this.h);
    } else {
        let ratio = this.img.width / this.img.height;
        image(this.img, 0, 0, ratio * this.h, this.h);
        fill('white');
        rect(this.w, 0, this.w, this.h);
    }
    

    textSize(14);
    rectMode(CORNER);

    if (this.mouseOver) {
        fill(100, 200);
        rect(0, 0, this.w, this.h);

        fill('white');
        textAlign(CENTER);
        for (let i = 0; i < this.text.length; i++){
            text(this.text[i], 0, this.h/2 - 15 + 32 * i, this.w, this.h);
        }
        
    }

    rectMode(CORNER)


}