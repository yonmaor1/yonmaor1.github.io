document.addEventListener('DOMContentLoaded', () => {
    const draggableRectangle = document.getElementById('draggable-rectangle');
    const contentContainer = document.getElementById('content-container');

    draggableRectangle.addEventListener('mousedown', onMouseDown);

    function onMouseDown(event) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(event) {
        const x = event.clientX;
        const y = event.clientY;
        draggableRectangle.style.left = `${x}px`;
        draggableRectangle.style.top = `${y}px`;
        checkCorners(x, y);
    }

    function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function checkCorners(x, y) {
        const threshold = 20; // Distance from corner to trigger navigation

        if (x <= threshold && y <= threshold) {
            loadContent('top-left.html', 'top-left-content');
        } else if (x >= window.innerWidth - threshold && y <= threshold) {
            loadContent('top-right.html', 'top-right-content');
        } else if (x <= threshold && y >= window.innerHeight - threshold) {
            loadContent('bottom-left.html', 'bottom-left-content');
        } else if (x >= window.innerWidth - threshold && y >= window.innerHeight - threshold) {
            loadContent('bottom-right.html', 'bottom-right-content');
        }
    }

    function loadContent(url, contentId) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                const content = tempDiv.querySelector(`#${contentId}`).innerHTML;
                contentContainer.innerHTML = content;
            })
            .catch(error => console.error('Error loading content:', error));
    }
});