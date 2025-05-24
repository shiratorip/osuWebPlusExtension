document.addEventListener('DOMContentLoaded', () => {
    // GitHub link handler
    document.querySelector('.github-link').addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: e.target.closest('a').href });
    });

    // Load saved settings
    chrome.storage.sync.get(['minimalistic_mode'], (result) => {
        document.querySelector('#minimalistic_mode').checked = result.minimalistic_mode || false;
    });

    // Settings submit handler
    document.querySelector('#submit').addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get all settings
        const settings = {
            minimalistic_mode: document.querySelector('#minimalistic_mode').checked
        };

        // Save settings
        chrome.storage.sync.set(settings, () => {
            chrome.tabs.reload();

            window.close();
        });
    });
});
