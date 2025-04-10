document.addEventListener('DOMContentLoaded', () => {
    const parentButtons = document.querySelectorAll('.parent-btn');
    const subButtons = document.querySelectorAll('.sub-btn');
    const subOptionsDiv = document.getElementById('sub-options');
    const submitBtn = document.getElementById('submit-btn');
    const selectionDisplay = document.getElementById('selection-display');
    const qrImage = document.getElementById('qr-code-image');
    let selectedParent = null;
    let selectedSub = null;
    let taskCount = 0;
    const maxTasks = 10;

    const productUrls = [
        'https://www.amazon.com/dp/B08N5WRWNV',
        'https://www.amazon.com/dp/B09B1N8N7B',
        'https://www.amazon.com/dp/B08J4C8K4M',
        'https://www.amazon.com/dp/B08P1VXB4J',
        'https://www.amazon.com/dp/B09K7JGC5W',
        'https://www.amazon.com/dp/B08J4C9K4M',
        'https://www.amazon.com/dp/B09B1N8N8C',
        'https://www.amazon.com/dp/B08N5WRWNX',
        'https://www.amazon.com/dp/B09K7JGC6X',
        'https://www.amazon.com/dp/B08P1VXB4K'
    ];

    function updateSelection() {
        selectionDisplay.querySelector('#selected-options').textContent = selectedParent
            ? `${selectedParent} - ${selectedSub || 'None'}`
            : 'None';
        submitBtn.disabled = !(selectedParent && selectedSub);
        submitBtn.classList.toggle('enabled', selectedParent && selectedSub);
    }

    parentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            parentButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedParent = btn.dataset.type;
            subOptionsDiv.style.display = 'block';
            updateSelection();
        });
    });

    subButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            subButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSub = btn.dataset.subtype;
            updateSelection();
        });
    });

    function generateQRCode(url) {
        if (qrImage) {
            new QRCode(qrImage, {
                text: url,
                width: 100,
                height: 100,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            qrImage.dataset.clickAdded = false;
            addClickEventToQrCode(qrImage);
        }
    }

    function submitSelection() {
        if (selectedParent && selectedSub && taskCount < maxTasks) {
            alert(`Submitted: ${selectedParent} - ${selectedSub}`);
            taskCount++;

            if (taskCount <= productUrls.length) {
                const url = productUrls[taskCount - 1];
                generateQRCode(url);
            } else {
                generateQRCode(productUrls[productUrls.length - 1]);
            }

            parentButtons.forEach(btn => btn.classList.remove('active'));
            subButtons.forEach(btn => btn.classList.remove('active'));
            subOptionsDiv.style.display = 'none';
            submitBtn.classList.remove('enabled');
            submitBtn.disabled = true;
            selectedParent = null;
            selectedSub = null;
            updateSelection();

            if (taskCount < maxTasks) {
                const proceed = confirm(`Task ${taskCount} of ${maxTasks} completed. Start the next task?`);
                if (!proceed) {
                    alert('Process stopped. You completed ' + taskCount + ' tasks.');
                    taskCount = maxTasks;
                }
            } else {
                alert('You have completed all 10 tasks! Well done!');
            }
        }
    }

    submitBtn.addEventListener('click', submitSelection);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !submitBtn.disabled) {
            submitSelection();
        }
    });

    function addClickEventToQrCode(qrImage) {
        if (qrImage && !qrImage.dataset.clickAdded) {
            qrImage.style.cursor = 'pointer';
            qrImage.style.border = '2px solid blue';
            qrImage.addEventListener('click', () => {
                if (!qrImage.complete || qrImage.naturalWidth === 0) {
                    alert('The QR code picture isn’t ready. Try again!');
                    return;
                }
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = qrImage.naturalWidth;
                canvas.height = qrImage.naturalHeight;
                context.drawImage(qrImage, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    const url = code.data;
                    if (url) {
                        window.open(url, '_blank');
                    } else {
                        alert('No address found in the QR code.');
                    }
                } else {
                    alert('Couldn’t read the QR code. Make sure it’s clear!');
                }
            });
            qrImage.dataset.clickAdded = 'true';
        }
    }

    if (qrImage && productUrls.length > 0) {
        generateQRCode(productUrls[0]);
    }
});
