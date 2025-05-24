const processedElements = new Set();

function checkForElements() {
    const scores = document.getElementsByClassName('play-detail__detail');
    Array.from(scores).forEach(score => {
        // Skip if we've already processed this element
        if (processedElements.has(score)) {
            return;
        }
        const group = score.closest('.play-detail.play-detail--highlightable');

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

        const beatmapset_panel_cover_container = document.createElement('a');
        beatmapset_panel_cover_container.className = 'beatmapset-panel__cover-container';
        beatmapset_panel_cover_container.href = "https://osu.ppy.sh/beatmapsets/"+beatmapsetId;

        const score_data_wrapper = document.createElement('div');
        score_data_wrapper.className = 'score-data-wrapper';

        Array.from(group.children).forEach((child) => {
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
                        console.log(download_link);
                        download_link.addEventListener('click', async (e) => {
                            e.preventDefault(); 
                            
                            const testLink = `osu://b/${beatmapId}`;
                            
                            window.location.href = testLink;
                            
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            if (window.location.href.includes('osu.ppy.sh/home/support')) {
                                history.back();
                                href = `https://osu.ppy.sh/beatmapsets/${beatmapsetId}/download`;
                                download_link.download();
                            }
                        });

                        const download_span = document.createElement('span');
                        download_span.className = 'fas fa-download';
                        download_link.appendChild(download_span);
                        score_detail.appendChild(download_link);
                    }
                }
            score_data_wrapper.appendChild(group.firstChild);
            }
        );

        

    
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



        beatmapset_panel_cover_col_play.appendChild(beatmapset_cover_background);
        beatmapset_panel_cover_container.appendChild(beatmapset_panel_cover_col_play);
        playercontainer.appendChild(beatmapset_panel_cover_container);
        playercontainer.appendChild(beatmapset_panel_content);
        playercontainer.appendChild(score_data_wrapper);
        group.prepend(playercontainer);


        processedElements.add(score);
    });
}

const observer = new MutationObserver(function(mutations) {
    checkForElements();
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
    childList: true,
    subtree: true
});

addEventListener("load", (event) => { 
    processedElements.clear();
    checkForElements();
})

//Check interval every 500ms 
setInterval(checkForElements, 500);

// Load settings at the start
chrome.storage.sync.get(['minimalistic_mode'], (result) => {
    if (result.minimalistic_mode) {
        document.body.classList.add('minimalistic-mode');
    }
});