document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const displayImage = document.getElementById('displayImage');
    const toggleBtn = document.getElementById('toggleBtn');
    const imageContainer = document.querySelector('.image-container');
    
    let isImageVisible = true;
    let imageLoaded = false;

    // Handle file upload
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                displayImage.src = e.target.result;
                displayImage.classList.add('show');
                imageContainer.classList.add('has-image');
                toggleBtn.disabled = false;
                imageLoaded = true;
                isImageVisible = true;
                updateToggleButtonText();
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    });

    // Handle toggle functionality
    toggleBtn.addEventListener('click', function() {
        if (!imageLoaded) return;
        
        isImageVisible = !isImageVisible;
        
        if (isImageVisible) {
            displayImage.classList.add('show');
        } else {
            displayImage.classList.remove('show');
        }
        
        updateToggleButtonText();
    });

    // Update toggle button text based on visibility state
    function updateToggleButtonText() {
        if (isImageVisible) {
            toggleBtn.textContent = 'Hide Image';
        } else {
            toggleBtn.textContent = 'Show Image';
        }
    }

    // Handle drag and drop functionality
    imageContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        imageContainer.style.borderColor = '#667eea';
        imageContainer.style.backgroundColor = '#f0f4ff';
    });

    imageContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        if (!imageLoaded) {
            imageContainer.style.borderColor = '#ddd';
            imageContainer.style.backgroundColor = 'transparent';
        }
    });

    imageContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            imageInput.files = files;
            
            // Trigger the change event manually
            const event = new Event('change', { bubbles: true });
            imageInput.dispatchEvent(event);
        }
        
        imageContainer.style.borderColor = imageLoaded ? '#667eea' : '#ddd';
        imageContainer.style.backgroundColor = imageLoaded ? '#f8f9ff' : 'transparent';
    });
});