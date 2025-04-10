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

    // When someone clicks the QR code image
    const qrImage = document.getElementById('qr-code-image');
    if (qrImage) {
        qrImage.addEventListener('click', () => {
            // Make sure the picture is ready
            if (!qrImage.complete || qrImage.naturalWidth === 0) {
                alert('The QR code picture isn’t ready. Try again!');
                return;
            }

            // Create a place to look at the picture
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = qrImage.naturalWidth;
            canvas.height = qrImage.naturalHeight;
            context.drawImage(qrImage, 0, 0, canvas.width, canvas.height);

            // Read the QR code
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                const url = code.data;
                if (url) {
                    window.open(url, '_blank'); // Open the Amazon page
                } else {
                    alert('No address found in the QR code.');
                }
            } else {
                alert('Couldn’t read the QR code. Make sure it’s clear!');
            }
        });
    }
}
