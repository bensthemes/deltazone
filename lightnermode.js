document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    const isActive = localStorage.getItem('lightnermode');

    if (isActive === 'true') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
});

// Event delegation (works with dynamically loaded header)
document.addEventListener('click', (e) => {
    if (e.target.id === 'theme-switch') {
        const isLight = document.body.classList.contains('light');

        if (isLight) {
            document.body.classList.remove('light');
            localStorage.setItem('lightnermode', 'false');
        } else {
            document.body.classList.add('light');
            localStorage.setItem('lightnermode', 'true');
        }
    }
});