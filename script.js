document.addEventListener('DOMContentLoaded', () => {
    const parentButtons = document.querySelectorAll('.parent-btn');
    const subButtons = document.querySelectorAll('.sub-btn');
    const subOptionsDiv = document.getElementById('sub-options');
    const submitBtn = document.getElementById('submit-btn');
    const selectedOptionsSpan = document.getElementById('selected-options');

    let selectedParent = null;
    let selectedSub = null;

    // Handle Parent Option Selection (Mouse)
    parentButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectParent(button);
        });
    });

    // Handle Sub-option Selection (Mouse)
    subButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectSub(button);
        });
    });

    // Handle Submit (Mouse)
    submitBtn.addEventListener('click', () => {
        submitSelection();
    });

    // Keyboard Shortcut Handling
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Parent options (1, 2, 3) - only if no parent is selected yet
        if (['1', '2', '3'].includes(key) && !selectedParent) {
            const index = parseInt(key) - 1;
            if (parentButtons[index]) {
                selectParent(parentButtons[index]);
                event.preventDefault();
            }
        }

        // Sub-options (1, 2, 3) - only if parent is selected and no sub-option yet
        else if (['1', '2', '3'].includes(key) && selectedParent && !selectedSub) {
            const index = parseInt(key) - 1;
            if (subButtons[index]) {
                selectSub(subButtons[index]);
                event.preventDefault();
            }
        }

        // Submit with Enter - only if both parent and sub-option are selected
        if (key === 'Enter' && selectedParent && selectedSub) {
            submitSelection();
        }
    });

    // Helper Functions
    function selectParent(button) {
        parentButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedParent = button.getAttribute('data-type');
        subOptionsDiv.style.display = 'block';
        selectedSub = null;
        subButtons.forEach(btn => btn.classList.remove('active'));
        submitBtn.classList.remove('enabled');
        submitBtn.disabled = true;
        updateSelection();
    }

    function selectSub(button) {
        subButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedSub = button.getAttribute('data-subtype');
        submitBtn.classList.add('enabled');
        submitBtn.disabled = false;
        updateSelection();
    }

    function updateSelection() {
        if (selectedParent && selectedSub) {
            selectedOptionsSpan.textContent = `${selectedParent} - ${selectedSub}`;
        } else if (selectedParent) {
            selectedOptionsSpan.textContent = `${selectedParent}`;
        } else {
            selectedOptionsSpan.textContent = 'None';
        }
    }

    function submitSelection() {
        if (selectedParent && selectedSub) {
            alert(`Submitted: ${selectedParent} - ${selectedSub}`);
            parentButtons.forEach(btn => btn.classList.remove('active'));
            subButtons.forEach(btn => btn.classList.remove('active'));
            subOptionsDiv.style.display = 'none';
            submitBtn.classList.remove('enabled');
            submitBtn.disabled = true;
            selectedParent = null;
            selectedSub = null;
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
