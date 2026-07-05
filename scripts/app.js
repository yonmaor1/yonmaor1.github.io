let first_time = true;

const pages = {
    'top-left': 'about',
    'top-right': 'gallery',
    'bottom-left': 'teaching',
    'bottom-right': 'projects'
};

const ids = Object.keys(pages).map(id => `desktop-${id}`);

document.addEventListener('DOMContentLoaded', () => {

    // load content for each corner
    Object.keys(pages).forEach(id => {
        fetch(`pages/${pages[id]}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(`desktop-${id}`).innerHTML = data;
                // document.getElementById(id).style.display = 'block';
            })
            .then(() => {
                if (pages[id] == 'gallery') {
                    createGallery();
                    initGalleryToggle();
                }
            })
            .catch(error => console.error('Error fetching content:', error));
    });

    // lines
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // make rectangle draggable
    const card = document.getElementById('draggable-rectangle');

    // Center the rectangle initially
    card.style.left = `${(window.innerWidth - card.offsetWidth) / 2}px`;
    card.style.top = `${(window.innerHeight - card.offsetHeight) / 2}px`;

    draw_lines(ctx, card, canvas);

    card.addEventListener('mousedown', on_mouse_down);

    let rect_initial_x, rect_initial_y;
    let mouse_initial_x, mouse_initial_y;
    function on_mouse_down(event) {
        mouse_initial_x = event.clientX;
        mouse_initial_y = event.clientY;

        rect_initial_x = card.offsetLeft;
        rect_initial_y = card.offsetTop;

        document.addEventListener('mousemove', on_mouse_move);
        document.addEventListener('mouseup', on_mouse_up);
    }

    function on_mouse_move(event) {
        const offset_x = event.clientX - mouse_initial_x;
        const offset_y = event.clientY - mouse_initial_y;

        const x = constrain(rect_initial_x + offset_x, 0, window.innerWidth - card.offsetWidth);
        const y = constrain(rect_initial_y + offset_y, 0, window.innerHeight - card.offsetHeight);

        card.style.left = `${x}px`;
        card.style.top = `${y}px`;

        if (!check_corners(x, y)){
            draw_lines(ctx, card, canvas);
            remove_dark_mode();
        } else {
            clear_canvas(ctx, canvas.width, canvas.height);
            set_dark_mode();
        }
    }

    function on_mouse_up(event) { 
        document.removeEventListener('mousemove', on_mouse_move);
        document.removeEventListener('mouseup', on_mouse_up);
    }

    // show / hide corners
    function check_corners(x, y) {

        const threshold = 1; // Distance from corner to trigger navigation

        if (x <= threshold && y <= threshold) {
            load_content('desktop-top-left');
            return true;
        } else if (x + card.offsetWidth >= window.innerWidth - threshold && y <= threshold) {
            load_content('desktop-top-right');
            return true;
        } else if (x <= threshold && y + card.offsetHeight>= window.innerHeight - threshold) {
            load_content('desktop-bottom-left');
            return true;
        } else if (x + card.offsetWidth >= window.innerWidth - threshold && y + card.offsetHeight >= window.innerHeight - threshold) {
            load_content('desktop-bottom-right');
            return true;
        } else {
            clear_content(ids);
            return false;
        }
    }

    clear_content(ids);

});

window.addEventListener('resize', () => {
    const card = document.getElementById('draggable-rectangle');
    const x = card.offsetLeft;
    const y = card.offsetTop;

    if (x + card.offsetWidth >= window.innerWidth) {
        card.style.left = `${window.innerWidth - card.offsetWidth}px`;
    } if (y + card.offsetHeight >= window.innerHeight) {
        card.style.top = `${window.innerHeight - card.offsetHeight}px`;
    }

    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw_lines(canvas.getContext('2d'), card, canvas);
});

// art page
function appendGallerySectionHeader(gallery, title) {
    const sectionHeader = document.createElement('div');
    sectionHeader.textContent = title;
    sectionHeader.classList.add('gallery-section-header');
    gallery.appendChild(sectionHeader);
}

function appendGalleryItem(gallery, piece) {
    const item = document.createElement('div');
    item.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = piece.img;
    img.alt = piece.name;

    const description = document.createElement('div');
    description.classList.add('description');

    const title = document.createElement('h2');
    title.textContent = piece.name;

    const medium = document.createElement('p');
    medium.textContent = piece.medium;

    description.appendChild(title);
    description.appendChild(medium);
    item.appendChild(img);
    item.appendChild(description);
    gallery.appendChild(item);

    item.addEventListener('click', () => {
        if (piece.link) {
            window.location.href = piece.link;
        } else {
            openLightbox(piece);
        }
    });
}

// enlarge a piece's image over a blurred backdrop; click anywhere to close
function openLightbox(piece) {
    const overlay = document.createElement('div');
    overlay.classList.add('lightbox');

    const img = document.createElement('img');
    img.src = piece.img;
    img.alt = piece.name;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => overlay.remove());
}

// group pieces (preserving order) by a key, returning [key, items] pairs
function groupPieces(items, keyFn) {
    const groups = new Map();
    items.forEach(piece => {
        const key = keyFn(piece);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(piece);
    });
    return [...groups.entries()];
}

function renderGalleryByType(gallery) {
    Object.keys(categoryLabels).forEach(category => {
        const items = pieces.filter(piece => piece.category === category);
        if (items.length === 0) return;
        appendGallerySectionHeader(gallery, categoryLabels[category]);
        items.forEach(piece => appendGalleryItem(gallery, piece));
    });
}

function renderGalleryByDate(gallery) {
    // newest first (full yyyymmdd); grouped by year, undated pieces last
    const yearOf = date => (date ? Math.floor(date / 10000) : 'undated');
    const sorted = [...pieces].sort((a, b) => (b.date ?? -Infinity) - (a.date ?? -Infinity));
    const groups = groupPieces(sorted, piece => yearOf(piece.date));
    groups.forEach(([year, items]) => {
        appendGallerySectionHeader(gallery, String(year));
        items.forEach(piece => appendGalleryItem(gallery, piece));
    });
}

function createGallery(galleryId = 'gallery', sortMode = 'date') {
    const gallery = document.getElementById(galleryId);
    gallery.innerHTML = '';

    if (sortMode === 'date') {
        renderGalleryByDate(gallery);
    } else {
        renderGalleryByType(gallery);
    }
}

// wire up the "sort by" toggle within a given gallery container's page
function initGalleryToggle(galleryId = 'gallery') {
    const toggle = document.querySelector(`#${galleryId}`)
        ?.closest('.gallery-container')
        ?.querySelector('.gallery-sort');
    if (!toggle) return;

    toggle.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-sort]');
        if (!button) return;

        toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        createGallery(galleryId, button.dataset.sort);
    });
}