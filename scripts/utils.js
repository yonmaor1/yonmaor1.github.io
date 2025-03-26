// general utility functions

const constrain = (x, lo, hi) => {
    if (x < lo) return lo;
    if (x > hi) return hi;
    return x;
}

const map = (x, ilo, ihi, olo, ohi) => {
    return (x - ilo) * (ohi - olo) / (ihi - ilo) + olo;
}

// loading / unloading
function load_content(content_id) {
    const content = document.getElementById(content_id);
    content.classList.remove('hidden');
}

function clear_content(ids) {
    for (const id of ids) {
        const content = document.getElementById(id);
        content.classList.add('hidden');
    }
}

// dark mode
function set_dark_mode() {
    document.body.classList.add('dark-mode');

    const event = new CustomEvent('darkModeEnabled', {
        detail: { enabled: true }
    });
    document.dispatchEvent(event);
}

function remove_dark_mode() {
    document.body.classList.remove('dark-mode');

    const event = new CustomEvent('darkModeDisabled', {
        detail: { enabled: true }
    });
    document.dispatchEvent(event);
}

// canvas
function clear_canvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}

function draw_lines(ctx, card, canvas, x = card.offsetLeft, y = card.offsetTop) {
    clear_canvas(ctx, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(0, 0);
    ctx.moveTo(x + card.offsetWidth, y);
    ctx.lineTo(canvas.width, 0);
    ctx.moveTo(x, y + card.offsetHeight);
    ctx.lineTo(0, canvas.height);
    ctx.moveTo(x + card.offsetWidth, y + card.offsetHeight);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}