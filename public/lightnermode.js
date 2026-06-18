document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    const isActive = localStorage.getItem('lightnermode');

    if (isActive === 'true') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }

    //syncIframeTheme();
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

        const iframe = document.getElementById('music-player');

        if (iframe && iframe.contentDocument) {
            iframe.contentDocument.body.classList.toggle(
                'light',
                document.body.classList.contains('light')
            );
        }

        //syncIframeTheme();
    }
});

/*
function syncIframeTheme() {
    const iframe = document.getElementById('player'); // your iframe id
    if (!iframe) return;

    try {
        const iframeBody = iframe.contentWindow.document.body;

        if (document.body.classList.contains('light')) {
            iframeBody.classList.add('light');
        } else {
            iframeBody.classList.remove('light');
        }
    } catch (err) {
        console.log('Cannot access iframe:', err);
    }
}

document.getElementById('player').addEventListener('load', syncIframeTheme);
*/