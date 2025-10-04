const resetMobileMenu = (mobileNav, activeButton = null) => {

    mobileNav.style.position = '';
    mobileNav.style.width = '';
    mobileNav.style.height = '';
    mobileNav.style.zIndex = '';
    mobileNav.style.background = '';

    // Move active button to the end, but ensure it's visible at the bottom
    if (activeButton) {
        mobileNav.appendChild(activeButton);
    } else {
        activeButton = mobileNav.querySelector('button.mobile-button.active');
    }

    // Hide all buttons except the active one
    mobileNav.querySelectorAll('button').forEach((btn) => {
        btn.classList.remove('active');
        if (activeButton && btn === activeButton) {
            btn.classList.remove('hidden');
            // Position active button at bottom of menu
            btn.style.position = 'absolute';
            btn.style.left = '0';
            btn.style.bottom = '0';
            btn.style.width = '100%';
            btn.style.zIndex = '2';
        } else {
            btn.classList.add('hidden');
            btn.style.position = '';
            btn.style.left = '';
            btn.style.bottom = '';
            btn.style.width = '';
            btn.style.zIndex = '';
        }
    });
    if (activeButton) {
        activeButton.classList.add('active');
    }
};

// Helper to toggle dark mode
function setMobileDarkMode(on) {
    if (on) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function updateView() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        document.getElementById('desktop-container').classList.add('hidden');
        document.getElementById('mobile-container').classList.remove('hidden');

        const buttons = document.querySelectorAll('#mobile-menu button');
        const mobileNav = document.getElementById('mobile-menu');
        const mobileLanding = document.getElementById('mobile-landing');
        const mobileContent = document.getElementById('mobile-content');

        // Show landing page and hide content by default
        mobileLanding.classList.remove('hidden');
        mobileContent.classList.add('hidden');
        setMobileDarkMode(true); // Enable dark mode on initial landing

        mobileNav.addEventListener('mousedown', () => {
            mobileNav.style.position = 'fixed';
            mobileNav.style.width = '100vw';
            // mobileNav.style.height = '100vh';
            mobileNav.style.zIndex = '9999';
            mobileNav.style.background = '#fff';

            mobileNav.classList.add('open');
            setMobileDarkMode(true);

            // Show all hidden buttons
            mobileNav.querySelectorAll('button.hidden').forEach(btn => {
                btn.classList.remove('hidden');
            });

            // mobileLanding.classList.remove('hidden');
            mobileContent.classList.add('hidden');
        });

        mobileNav.addEventListener('mouseup', () => {
            resetMobileMenu(mobileNav);
            mobileNav.classList.remove('open');
            setMobileDarkMode(false);

            // Hide landing, show content
            mobileContent.classList.remove('hidden');
        });
        // Remove mouseleave event to prevent unwanted dark mode/content toggle

        buttons.forEach(button => {
            button.addEventListener('mouseup', () => {
                const page = button.getAttribute('data-page');
                console.log(page)
                if (page === 'landing') {
                    // Show landing page, hide content, set dark mode, set active button
                    mobileLanding.classList.remove('hidden');
                    mobileContent.classList.add('hidden');
                    setMobileDarkMode(true);
                    resetMobileMenu(document.getElementById('mobile-menu'), button);
                } else {
                    fetch(`/pages/${page}.html`)
                        .then(response => response.text())
                        .then(data => {
                            mobileContent.innerHTML = data;

                            // Call createGallery() if the "art" page is loaded
                            if (page === 'top-right') {
                                const mobileGallery = document.querySelector('#mobile-content #gallery');
                                if (mobileGallery) {
                                    mobileGallery.id = 'mobile-gallery';
                                    createGallery('mobile-gallery');
                                }
                            }
                        })
                        .then(() => {
                            resetMobileMenu(document.getElementById('mobile-menu'), button);
                            // Hide landing, show content
                            mobileLanding.classList.add('hidden');
                            mobileContent.classList.remove('hidden');
                        })
                        .catch(error => console.error('Error loading page:', error));
                }
            });
        });

        // Show landing page on initial load
        mobileLanding.classList.remove('hidden');
        mobileContent.classList.add('hidden');
        setMobileDarkMode(true); // Enable dark mode on initial landing

        // Set 'click + hold' as active button on landing
        resetMobileMenu(document.getElementById('mobile-menu'), buttons[0]);

        // Load the first page by default, but keep landing visible
        fetch('/pages/top-left.html')
            .then(response => response.text())
            .then(data => {
                mobileContent.innerHTML = data;
            })
            .catch(error => console.error('Error loading page:', error));
    } else {
        document.getElementById('desktop-container').classList.remove('hidden');
        document.getElementById('mobile-container').classList.add('hidden');
        document.body.classList.remove('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
    updateView();
    
    // Update view on resize
    window.addEventListener('resize', updateView);

    // Mobile Settings
    $("#mobile-menu").taphold((e) => {
        e.preventDefault();
    });
});