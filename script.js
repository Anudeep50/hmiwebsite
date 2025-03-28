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
                event.preventDefault(); // Prevent immediate sub-option selection
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
        submitBtn.disabled = false; // Submit becomes available here
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
});
