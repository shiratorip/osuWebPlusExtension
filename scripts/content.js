// Keep track of processed elements
const processedElements = new Set();

// Add a style element for media queries
const styleElement = document.createElement('style');
document.head.appendChild(styleElement);
styleElement.textContent = `
    @media screen and (min-width: 900px) {
        .play-detail.play-detail--highlightable {
            max-height: 60px;
        }
    }
        .score-data-wrapper{
            border-radius: 9px;
            flex: 1;
            margin-right: 10px;
            padding-left: 10px;
            display: flex;
            justify-content: space-between;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            width: calc(100% - var(--play-width));
            transition: all 120ms ease-in-out;
            background-color: var(--background-extra-dark);
        }
`;

function checkForElements() {
    const scores = document.getElementsByClassName('play-detail__detail');
    Array.from(scores).forEach(score => {
        // Skip if we've already processed this element
        if (processedElements.has(score)) {
            return;
        }
        const group = score.closest('.play-detail.play-detail--highlightable');

        group.style.height = '80px';
        group.style = `
            height:80px;
        `;

 //get beatmap id
        const titleElement = score.querySelector(".play-detail__title.u-ellipsis-overflow");
        const bId = titleElement ? titleElement.getAttribute('href').match(/beatmapsets\/(\d+)/)[1] : 'error fetching id';
//add main container(for player+score data)
        const playercontainer = document.createElement('div');
        playercontainer.className = 'beatmapset-panel beatmapset-panel--size-normal js-audio--player';
        playercontainer.setAttribute('data-audio-url', "//b.ppy.sh/preview/"+bId+".mp3");
        playercontainer.style = `
            --beatmaps-popup-transition-duration: 150ms;
            --duration: '0:10';
            --current-time: '0:00';
            --progress: 0;
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: row;
            transition: all 120ms ease-in-out;
            height:100%;
            background-color: hsla(0,0%,0%,0);
        `;
        playercontainer.setAttribute('data-audio-has-duration', 1);
        playercontainer.setAttribute('data-audio-state', "paused");
        playercontainer.setAttribute('data-audio-time-format', "minute_minimal");
        playercontainer.setAttribute('data-audio-over50', 0);


        

        const beatmapset_panel_cover_container = document.createElement('a');
        beatmapset_panel_cover_container.style= 
        `
            display: flex;
            height: 100%;
            left: 0;
            pointer-events: var(--global-beatmap-link-pointer-events);
            position: relative;
            top: 0;            
            width: calc(100%-20px);
        `;
        beatmapset_panel_cover_container.className = 'beatmapset-panel__cover-container';
        beatmapset_panel_cover_container.href = "https://osu.ppy.sh/beatmapsets/"+bId;

        const score_data_wrapper = document.createElement('div');

        score_data_wrapper.className = 'score-data-wrapper';
        
        while(group.firstChild){
            if(group.firstChild.className == 'js-score-pin-sortable-handle hidden-xs sortable-handle sortable-handle--score-pin ui-sortable-handle'){
                playercontainer.appendChild(group.firstChild);
                continue;
            }
            score_data_wrapper.appendChild(group.firstChild);
        }

    
        const beatmapset_panel_cover_col_play = document.createElement('div');
        beatmapset_panel_cover_col_play.className = 'beatmapset-panel__cover-col beatmapset-panel__cover-col--play';

        const beatmapset_cover_background = document.createElement('div');
        beatmapset_cover_background.className = 'beatmapset-cover beatmapset-cover--full'
        const link = "https://assets.ppy.sh/beatmaps/"+bId+"/covers/list.jpg";
        const link2 = "https://assets.ppy.sh/beatmaps/"+bId+"/covers/list@2x.jpg";
        beatmapset_cover_background.style = `--bg: url("${link}"); --bg-2x: url("${link2}");`;




        beatmapset_panel_cover_col_play.appendChild(beatmapset_cover_background);
        beatmapset_panel_cover_container.appendChild(beatmapset_panel_cover_col_play);
        playercontainer.appendChild(beatmapset_panel_cover_container);
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

checkForElements();