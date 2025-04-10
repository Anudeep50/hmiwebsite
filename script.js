document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-btn');
    const submitBtn = document.getElementById('submit-btn');
    const selectedOptionsSpan = document.getElementById('selected-options');

    let selectedParent = null;
    let selectedSub = null;
    let selectedButton = null;

    // Handle Option Selection (Mouse)
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectOption(button);
        });
    });

    // Handle Submit (Mouse)
    submitBtn.addEventListener('click', () => {
        submitSelection();
    });

    // Keyboard Shortcut Handling
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Options (1-9)
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
            const index = parseInt(key) - 1;
            if (optionButtons[index]) {
                selectOption(optionButtons[index]);
                event.preventDefault();
            }
        }

        // Submit with Enter - only if an option is selected
        if (key === 'Enter' && selectedParent && selectedSub) {
            submitSelection();
        }
    });

    // Helper Functions
    function selectOption(button) {
        // Clear previous selection
        if (selectedButton) {
            selectedButton.classList.remove('active');
        }
        
        // Set new selection
        button.classList.add('active');
        selectedButton = button;
        selectedParent = button.getAttribute('data-parent');
        selectedSub = button.getAttribute('data-sub');
        
        // Enable submit button
        submitBtn.classList.add('enabled');
        submitBtn.disabled = false;
        
        // Update selection display
        updateSelection();
    }

    function updateSelection() {
        if (selectedParent && selectedSub) {
            selectedOptionsSpan.textContent = `${selectedParent} - ${selectedSub}`;
        } else {
            selectedOptionsSpan.textContent = 'None';
        }
    }

    function submitSelection() {
        if (selectedParent && selectedSub) {
            alert(`Submitted: ${selectedParent} - ${selectedSub}`);
            
            // Reset selections
            if (selectedButton) {
                selectedButton.classList.remove('active');
            }
            submitBtn.classList.remove('enabled');
            submitBtn.disabled = true;
            selectedParent = null;
            selectedSub = null;
            selectedButton = null;
            updateSelection();
        }
    }

    // Add click event for QR code image to decode and open URL
    const qrImage = document.getElementById('qr-code-image');
    if (qrImage) {
        qrImage.addEventListener('click', () => {
            // Ensure the image is fully loaded
            if (!qrImage.complete || qrImage.naturalWidth === 0) {
                alert('QR code image is not fully loaded. Please try again.');
                return;
            }

            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = qrImage.naturalWidth;
            canvas.height = qrImage.naturalHeight;
            context.drawImage(qrImage, 0, 0, canvas.width, canvas.height);

            // Get image data
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                const url = code.data;
                if (url) {
                    window.open(url, '_blank');
                } else {
                    alert('No URL found in the QR code.');
                }
            } else {
                alert('Failed to decode the QR code. Please ensure the QR code is clear and try again.');
            }
        });
    }
});
