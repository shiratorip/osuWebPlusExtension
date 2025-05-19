document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.github-link').addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: e.target.closest('a').href });
    });
});