let API_KEY = "AIzaSyB8AHQr5PHEQgS277d3oFAf0Uz4UKlzINE";

let state = {
    lastSearchTerm : "",
    currentNextPageToken : "",
    currentPrevPageToken : ""
}

function videoSearch(searchTerm, pageToken){
    state.lastSearchTerm = searchTerm;

    let paramPage = "";
    console.log(pageToken);

    if(pageToken != "" && pageToken != null){
        paramPage = `&pageToken=${pageToken}`;
    }

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchTerm}${paramPage}&key=${API_KEY}`;
    console.log(url);

    let settings = {
        method : 'GET'
    }

    fetch(url, settings).then(response => {
        if(response.ok){
            return response.json();
        }

        throw new Error(response.statusText);
    }).then(responeJSON => {
        console.log(responeJSON);
        displayResults(responeJSON);
    }).catch(err => {
        console.log(err.message);
    })
}

function displayResults(data){
    scrollTop();

    //Update State
    state.currentPrevPageToken = data.prevPageToken;
    state.currentNextPageToken = data.nextPageToken;

    console.log(state);

    videos = data.items;

    let results = document.querySelector('.results');
    results.innerHTML = "";

    for(let i = 0; i < videos.length; i++){
        if(videos[i].id.kind != "youtube#channel")
        {
            results.innerHTML +=`
            <div class="videoResult">
                <h2>
                    <a href="https://www.youtube.com/watch?v=${videos[i].id.videoId}" target="_blank"> ${videos[i].snippet.title} </a> by <a href="https://www.youtube.com/channel/${videos[i].snippet.channelId}" target="_blank"> ${videos[i].snippet.channelTitle} </a>
                </h2>
                <p>
                    ${videos[i].snippet.description}
                </p>
                <a href="https://www.youtube.com/watch?v=${videos[i].id.videoId}" target="_blank">
                    <img src="${videos[i].snippet.thumbnails.medium.url}">
                </a>
            </div>
            `;
        }
    }
    
}

function changePage(){
    let actionBtn = document.getElementById("pageButtons");

    actionBtn.addEventListener('click', (event) => {
        event.preventDefault();

        console.log(event.target);
        console.log(state.currentPrevPageToken);
        console.log(state.currentNextPageToken);

        if(event.target.matches('#prevPage')){
            if(state.currentPrevPageToken != "" && state.currentPrevPageToken != null){
                videoSearch(state.lastSearchTerm, state.currentPrevPageToken);
            }
        }

        if(event.target.matches('#nextPage')){
            if(state.currentNextPageToken != "" && state.currentNextPageToken != null){
                videoSearch(state.lastSearchTerm, state.currentNextPageToken);
            }
        }
    });
}

function watchForm(){
    let submitBtn = document.querySelector('.submitBtn');

    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();

        let searchTerm = document.querySelector('#searchTerm');

        videoSearch(searchTerm.value, null);
    });
}

function scrollTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function init(){
    watchForm();
    changePage();
}

init();
