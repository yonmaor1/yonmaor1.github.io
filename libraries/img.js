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

    let ratio;
    let iw, ih;
    let maskx, masky;
    if (this.img.height > this.img.width) {
        ratio = this.img.height / this.img.width;
        iw = this.w;
        ih = ratio * this.w;
        maskx = 0;
        masky = this.h
    } else {
        ratio = this.img.width / this.img.height;
        iw = ratio * this.h;
        ih = this.h;
        maskx = this.w;
        masky = 0;
    }

    if (this.clicked) {
        image(this.img, 0, 0, iw * 2, ih * 2);
        fill('white');
        rect(maskx, masky, this.w * 2, this.h * 2);

        push();
        translate(iw * 2);
        rectMode(CORNER);
        textAlign(LEFT, TOP);
        textSize(22);

        for (let i = 0; i < this.text.length; i++){
            text(this.text[i], 0, 28 * i, iw * 2, height);
        }

        pop();
        
        return;
    }

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
        for (let i = 0; i < min(2, this.text.length); i++){
            text(this.text[i], 0, this.h/2 - 15 + 32 * i, this.w, this.h);
        }
        
    }

    rectMode(CORNER)


}