function makeImg(url, iname, iw, ih) {
    let img = {
        img: url, name: iname,
        w: iw, h: ih,
        mouseOver: false,
        draw: draw_image,
    }

    return img;
}

function draw_image() {

    image(this.img, 0, 0, this.w, this.h);

    if (this.mouseOver) {
        fill(100, 100);
        rect(w/2, h/2, w, h);

        text(this.name, w/2, h/2);
    }

}