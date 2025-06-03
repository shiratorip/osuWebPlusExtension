const processedElements = new Set();
let scoreCounter = 0;
let currentUrl = window.location.href;
let isMinimalisticMode = false;


function isOnUserProfilePage() {
    return window.location.pathname.match(/^\/users\/\d+/) !== null;
}

function detectUrlChange() {
    const newUrl = window.location.href;
    if (currentUrl !== newUrl) {
        console.log('URL changed from', currentUrl, 'to', newUrl);
        currentUrl = newUrl;
        
        resetScoreCounter();
        applyMinimalisticMode();
        
        return true;
    }
    return false;
}

function checkForElements() {
    if (!isOnUserProfilePage()) {
        return;
    }

    const scores = document.getElementsByClassName('play-detail__detail');
    Array.from(scores).forEach(score => {
        // Check if this score has already been processed
        if (processedElements.has(score)) {
            const group = score.closest('.play-detail.play-detail--highlightable, .play-detail.play-detail--active');
            if (group && !group.classList.contains('osuWebPlus-class')) {
                group.classList.add('osuWebPlus-class');
            }
            return;
        }
        
        const group = score.closest('.play-detail.play-detail--highlightable, .play-detail.play-detail--active');
        
        // Check if the group already has a player container
        if (group.querySelector('.beatmapset-panel')) {
            processedElements.add(score);
            return;
        }

        //get beatmap id
        const titleElement = score.querySelector(".play-detail__title.u-ellipsis-overflow");
        const beatmapsetId = titleElement ? titleElement.getAttribute('href').match(/beatmapsets\/(\d+)/)[1] : 'error fetching id';
        const beatmapId = titleElement ? titleElement.getAttribute('href').match(/beatmapsets\/\d+#\w+\/(\d+)/)[1] : 'error fetching id';

        //add main container(for player+score data)
        const playercontainer = document.createElement('div');
        playercontainer.className = 'beatmapset-panel beatmapset-panel--size-normal js-audio--player';
        playercontainer.setAttribute('data-audio-url', "//b.ppy.sh/preview/"+beatmapsetId+".mp3");
        playercontainer.setAttribute('data-audio-has-duration', 1);
        playercontainer.setAttribute('data-audio-state', "paused");
        playercontainer.setAttribute('data-audio-time-format', "minute_minimal");
        playercontainer.setAttribute('data-audio-over50', 0);

        //add counter
        if (group) {
            group.classList.add('osuWebPlus-class');
            const bestPerformanceHeader = document.querySelector('body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div.user-profile-pages.ui-sortable > div:nth-child(3) > div > div.lazy-load > h3:nth-child(3)');
            let isInBestPerformance = false;
            
            if (bestPerformanceHeader && bestPerformanceHeader.textContent.includes('Best Performance')) {
                // Find the container that comes after the Best Performance header
                let currentElement = bestPerformanceHeader.nextElementSibling;
                while (currentElement) {
                    if (currentElement.contains(group)) {
                        isInBestPerformance = true;
                        break;
                    }
                    currentElement = currentElement.nextElementSibling;
                }
            }
            if (isInBestPerformance) {

            scoreCounter++;
            const counterElement = document.createElement('div');
            counterElement.className = 'osuWebPlus-counter';
            counterElement.textContent = `#${scoreCounter}`;
            
            playercontainer.appendChild(counterElement);
            }
        }
        
    

        const beatmapset_panel_cover_container = document.createElement('a');
        beatmapset_panel_cover_container.className = 'beatmapset-panel__cover-container';
        beatmapset_panel_cover_container.href = "https://osu.ppy.sh/beatmapsets/"+beatmapsetId;

        const score_data_wrapper = document.createElement('div');
        score_data_wrapper.className = 'score-data-wrapper';

        Array.from(group.children).forEach((child) => {
            // Skip the counter element we just added
            if (child.className === 'osuWebPlus-counter') {
                return;
            }
            
            if(group.firstChild.className == 'js-score-pin-sortable-handle hidden-xs sortable-handle sortable-handle--score-pin ui-sortable-handle' ||
                group.firstChild.className == 'js-score-pin-sortable-handle hidden-xs sortable-handle sortable-handle--score-pin'
                ){
                    playercontainer.appendChild(group.firstChild);
                    return;
                }
                if(group.firstChild.className == 'play-detail__group play-detail__group--bottom'){
                    const score_detail = group.querySelector('.play-detail__score-detail--score'); 
                    if (score_detail) {
                        const download_link = document.createElement('a');
                        download_link.href = `https://osu.ppy.sh/beatmapsets/${beatmapsetId}/download`;
                        
                        const download_span = document.createElement('span');
                        download_span.className = 'fas fa-download';
                        download_link.appendChild(download_span);
                        score_detail.appendChild(download_link);
                    }
                }
            score_data_wrapper.appendChild(group.firstChild);
            }
        );

        const player = createPlayer(beatmapsetId);

        const beatmapset_panel_cover_col_play = player.coverColPlay;

        beatmapset_panel_cover_col_play.appendChild(player.coverBackground);
        beatmapset_panel_cover_container.appendChild(beatmapset_panel_cover_col_play);
        playercontainer.appendChild(beatmapset_panel_cover_container);
        playercontainer.appendChild(player.content);
        playercontainer.appendChild(score_data_wrapper);
        group.prepend(playercontainer);

        processedElements.add(score);
    });
}

function createPlayer(beatmapsetId) {
    const beatmapset_panel_cover_col_play = document.createElement('div');
    beatmapset_panel_cover_col_play.className = 'beatmapset-panel__cover-col beatmapset-panel__cover-col--play';

    const beatmapset_cover_background = document.createElement('div');
    beatmapset_cover_background.className = 'beatmapset-cover beatmapset-cover--full'
    const link = "https://assets.ppy.sh/beatmaps/"+beatmapsetId+"/covers/list.jpg";
    const link2 = "https://assets.ppy.sh/beatmaps/"+beatmapsetId+"/covers/list@2x.jpg";
    beatmapset_cover_background.style = `--bg: url("${link}"); --bg-2x: url("${link2}");`;

    const beatmapset_panel_content = document.createElement('div');
    beatmapset_panel_content.className = 'beatmapset-panel__content';

    const beatmapset_panel_play_container = document.createElement('div');
    beatmapset_panel_play_container.className = 'beatmapset-panel__play-container';

    const beatmapset_panel_play = document.createElement('button');
    beatmapset_panel_play.className = 'beatmapset-panel__play js-audio--play';
    beatmapset_panel_play.type = 'button';

    const play_button = document.createElement('span');
    play_button.className = 'play-button';

    const beatmapset_panel_play_progress = document.createElement('div');
    beatmapset_panel_play_progress.className = 'beatmapset-panel__play-progress';

    const beatmapset_panel_play_icons = document.createElement('div');
    beatmapset_panel_play_icons.className = 'beatmapset-panel__play-icons';

    const circular_progress = document.createElement('div');
    circular_progress.className = 'circular-progress circular-progress--beatmapset-panel';
    circular_progress.title = '0 / 1';

    const circular_progress_label = document.createElement('div');
    circular_progress_label.className = 'circular-progress__label';
    circular_progress_label.textContent = '1';

    const circular_progress_slice = document.createElement('div');
    circular_progress_slice.className = 'circular-progress__slice';

    const circular_procress_circle = document.createElement('div');
    circular_procress_circle.className = 'circular-progress__circle';

    const circular_progress_circle_fill = document.createElement('div');
    circular_progress_circle_fill.className = 'circular-progress__circle circular-progress__circle--fill';

    circular_progress_slice.appendChild(circular_procress_circle);
    circular_progress_slice.appendChild(circular_progress_circle_fill);
    circular_progress.appendChild(circular_progress_label);
    circular_progress.appendChild(circular_progress_slice);
    beatmapset_panel_play_progress.appendChild(circular_progress);
    beatmapset_panel_play.appendChild(play_button);
    beatmapset_panel_play_container.appendChild(beatmapset_panel_play);
    beatmapset_panel_play_container.appendChild(beatmapset_panel_play_progress);
    beatmapset_panel_play_container.appendChild(beatmapset_panel_play_icons);
    beatmapset_panel_content.appendChild(beatmapset_panel_play_container);

    return {
        coverColPlay: beatmapset_panel_cover_col_play,
        coverBackground: beatmapset_cover_background,
        content: beatmapset_panel_content
    };
}

function resetScoreCounter() {
    scoreCounter = 0;
    processedElements.clear();
}

function applyMinimalisticMode() {
    if (isMinimalisticMode) {
        document.body.classList.add('minimalistic-mode');
    } else {
        document.body.classList.remove('minimalistic-mode');
    }
}

// Replace debounced observer with direct check
const observer = new MutationObserver(function(mutations) {
    let shouldCheck = false;
    
    for (let mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1 && 
                    (node.classList?.contains('play-detail') || 
                    node.querySelector?.('.play-detail__detail'))) {
                    shouldCheck = true;
                    break;
                }
            }
        }
        if (shouldCheck) break;
    }
    
    if (shouldCheck) {
        detectUrlChange();
        checkForElements();
    }
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Load settings and initialize
function initialize() {
    chrome.storage.sync.get(['minimalistic_mode'], (result) => {
        isMinimalisticMode = result.minimalistic_mode || false;
        applyMinimalisticMode();
        
        // Initial check
        setTimeout(() => {
            resetScoreCounter();
            checkForElements();
        }, 500);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

//interval checks
setInterval(() => {
    detectUrlChange();
    checkForElements();
}, 500); 