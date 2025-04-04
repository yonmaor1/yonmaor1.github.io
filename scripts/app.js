let first_time = true;

document.addEventListener('DOMContentLoaded', () => {

    // load content for each corner
    const ids = ['desktop-top-left', 'desktop-top-right', 'desktop-bottom-left', 'desktop-bottom-right'];
    ids.forEach(id => {
        const trimmed_id = id.replace('desktop-', '');
        fetch(`pages/${trimmed_id}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
                // document.getElementById(id).style.display = 'block';
            })
            .then(() => {
                if (trimmed_id == 'top-right') {
                    createGallery();
                }
            })
            .catch(error => console.error('Error fetching content:', error));
    })

    

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
function createGallerySection(links, names, title, galleryId) {
    const gallery = document.getElementById(galleryId);

    // Create and append the section header
    const sectionHeader = document.createElement('div');
    sectionHeader.textContent = title;
    sectionHeader.classList.add('gallery-section-header');
    gallery.appendChild(sectionHeader);

    links.forEach((link, index) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = link;
        img.alt = names[index][0];

        const description = document.createElement('div');
        description.classList.add('description');

        const title = document.createElement('h2');
        title.textContent = names[index][0];

        const medium = document.createElement('p');
        medium.textContent = names[index][1];

        description.appendChild(title);
        description.appendChild(medium);
        item.appendChild(img);
        item.appendChild(description);
        gallery.appendChild(item);
    });
}

function createGallery(galleryId = 'gallery') {
    createGallerySection(two_d_links, two_d_names, '2D work', galleryId);
    createGallerySection(three_d_links, three_d_names, '3D work', galleryId);
    createGallerySection(electronic_links, electronic_names, 'Electronic work', galleryId);
}
