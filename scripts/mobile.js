// Mobile navigation: press and hold the bottom bar to unravel the full menu,
// then release over a page to open it. Releasing before the menu has finished
// unraveling (or over the landing button) collapses back to the landing page.

const UNRAVEL_MS = 300; // keep in sync with the mobile-unravel animation in mobile.css

function setMobileDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
}

function initMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const landing = document.getElementById('mobile-landing');
    const content = document.getElementById('mobile-content');
    const buttons = [...menu.querySelectorAll('.mobile-button')];
    const landingButton = menu.querySelector('[data-page="landing"]');

    let holding = false;
    let unraveled = false;
    let unravelTimer = null;

    const setActive = (btn) => {
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        menu.appendChild(btn); // keep the current page as the lowest (anchor) item
    };

    const highlight = (x, y) => {
        const target = document.elementFromPoint(x, y);
        const btn = target && target.closest('.mobile-button');
        buttons.forEach(b => b.classList.toggle('hover', b === btn));
    };

    const showLanding = () => {
        landing.classList.remove('hidden');
        content.classList.add('hidden');
        setMobileDarkMode(true);
        setActive(landingButton);
    };

    const openPage = (btn) => {
        const file = pages[btn.dataset.page];
        fetch(`/pages/${file}.html`)
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;

                if (file === 'gallery') {
                    const gallery = content.querySelector('#gallery');
                    if (gallery) {
                        gallery.id = 'mobile-gallery';
                        createGallery('mobile-gallery');
                        initGalleryToggle('mobile-gallery');
                    }
                }

                landing.classList.add('hidden');
                content.classList.remove('hidden');
                setMobileDarkMode(false);
                setActive(btn);
                landingButton.textContent = 'home'; // no longer the initial landing prompt
            })
            .catch(error => console.error('Error loading page:', error));
    };

    const openMenu = () => {
        holding = true;
        unraveled = false;
        menu.classList.add('open');
        setMobileDarkMode(true);
        clearTimeout(unravelTimer);
        unravelTimer = setTimeout(() => { unraveled = true; }, UNRAVEL_MS);
    };

    const closeMenu = () => {
        menu.classList.remove('open');
        buttons.forEach(b => b.classList.remove('hover'));
        clearTimeout(unravelTimer);
    };

    const onMove = (event) => {
        if (holding) highlight(event.clientX, event.clientY);
    };

    const onUp = (event) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        if (!holding) return;
        holding = false;

        const target = document.elementFromPoint(event.clientX, event.clientY);
        const btn = target && target.closest('.mobile-button');
        // only navigate if the menu fully unraveled and released over a page
        const selected = unraveled && btn && btn.dataset.page !== 'landing' ? btn : null;

        closeMenu();
        if (selected) {
            openPage(selected);
        } else {
            showLanding();
        }
    };

    menu.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        openMenu();
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        document.addEventListener('pointercancel', onUp);
    });

    // long-press otherwise pops the browser context / callout menu
    menu.addEventListener('contextmenu', (event) => event.preventDefault());

    showLanding();
}

function updateView() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const desktop = document.getElementById('desktop-container');
    const mobile = document.getElementById('mobile-container');

    if (!isMobile) {
        desktop.classList.remove('hidden');
        mobile.classList.add('hidden');
        document.body.classList.remove('dark-mode');
        return;
    }

    desktop.classList.add('hidden');
    mobile.classList.remove('hidden');

    // attach the menu handlers only once, no matter how often we resize
    if (!mobile.dataset.initialized) {
        mobile.dataset.initialized = 'true';
        initMobileMenu();
    }
}

// Initial setup
updateView();

// Update view on resize
window.addEventListener('resize', updateView);
