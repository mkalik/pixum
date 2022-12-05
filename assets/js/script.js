
var genre_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21/?genres=';
var length_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21?moviemeter='; //comma separated numbers
var actor;
var actor_imdbAPI = 'https://imdb-api.com/en/API/SearchName/k_gqv62f21/'; //requires an actors name
var name_imdbAPI = 'https://imdb-api.com/API/Name/k_gqv62f21/'; //requires imdbID
var movie_imdbAPI = 'https://imdb-api.com/en/API/Title/k_gqv62f21/';
// var imdbID;
// var watchAPI1 = 'https://api.watchmode.com/v1/title/';
// var watchAPI2 = '/sources/?apiKey=VdPS48VbVT9u5JoyVOSjCyMC8zbheghplfqA9HX9'; //title must be defined, should used imdbID.

var omdbAPI = 'http://www.omdbapi.com/?i=tt3896198&apikey=c4ce22ab'; //might not even be used
var ratingsAPI = 'https://imdb-api.com/en/API/Ratings/k_gqv62f21/'; //requires imdbID

var id_title = {};
var json_actor;
var actorInfo = document.querySelector('.actor-info');

// actor = prompt('enter an actors name', '');
// getActorID(actor);

// var genre;
// genre = prompt('what genre(s) would you like to search for?', '');
// getGenre(genre);

function getGenre(genre) {
    fetch(genre_imdbAPI + genre + '&count=25')
        .then((data) => data.json())
        .then((movies) => genre_card(movies));
}
function genre_card(movies) {
    var title = [];
    var images = [];
    var plot = [];
    for (var i = 0; i < movies.length; i++) {
        title = movies[i].title;
        images = movies[i].image;
        plot = movies[i].plot;
        console.log(
            'title:  ' + title[i],
            'plot: ' + plot[i],
            'images: ' + images[i]
        );
    }
}

//actor-search;

function getActorID(name) {
    fetch(actor_imdbAPI + name)
        .then((data) => data.json())
        .then((results) => results.results[0].id)
        .then((nm_id) => knownFor(nm_id));
}

function knownFor(name) {
    fetch(name_imdbAPI + name)
        .then((name_info) => name_info.json())
        .then(function (info) {
            return info;
        })
        .then((info) => actor_card(info));
}
function actor_card(info) {
    var knownfor = info.knownFor;
    console.log(knownfor);

    // document.querySelector('.movie-1').src = knownfor[0].image;
    var movie_titles = [];
    for (var i = 0; i < knownfor.length; i++) {
        movie_titles = knownfor[i].fullTitle;
        var movie = '.movie-' + (i + 1);
    }
    return;
}

function useData(name, actor_movies) {
    id_title = actor_movies;
    console.log(id_title);
}



// connor work: targeting blank div on html to begin filling search results

var searchResultContainer = $('#search-results-container')

function createBlankResultCards(){
    var numberOfResults = 4
    for (i=0; i < numberOfResults; i++){
        var blankResultCard = $('<div class="blank-result-card"></div>');

        var moviePoster = $('<img class="movie-poster">');
        blankResultCard.append(moviePoster);

        var movieTitle = $('<h1 class= "movie-title">Title</h1>');
        blankResultCard.append(movieTitle);

        var movieRating = $('<h3 class="movie-rating">Rating</h3>')
        blankResultCard.append(movieRating);

        var moreInfoBtn = $('<button class="more-info-button">More Info</button>')
        blankResultCard.append(moreInfoBtn);

        $(blankResultCard).attr('data-result-index', i);

        searchResultContainer.append(blankResultCard);
    }
};

createBlankResultCards();

$('#search-filter-dropdown').click(function(event){
    var element = event.target;
    var selectedFilter = $('#selected-filter');
    var userSelection = $(element).text();

    setTimeout(function(){
        $(selectedFilter).text(userSelection);
    },50);

    if (userSelection === "Genre"){
        $('.separator').css('height', '180px');
    } else if( userSelection === "Actor"){
        $('.separator').css('height', '60px');
    } else if( userSelection === "Length"){
        $('.separator').css('height', '60px');
    }
});

function createGenreFilters(){
    var genreFilterGrid = $('#genre-filter-grid');

    var availableGenres = "action,adventure,animation,biography,comedy,crime,documentary,drama,family,fantasy,film noir,game_show,history,horror,music,musical,mystery,news,reality tv,romance,sci_fi,sport,talk show,thriller,war,western"
    var genreFilters = availableGenres.split(',');

    var displayedGenres = "action,adventure,animation,biography,comedy,crime,documentary,drama,family,fantasy,film noir,game show,history,horror,music,musical,mystery,news,reality tv,romance,sci fi,sport,talk show,thriller,war,western"
    var displayFilters = displayedGenres.split(',');

    for (i=0; i < genreFilters.length; i++){
        var genreButton = $('<button class="button is-rounded is-small column genre-button" data-search="false" data-genre='+genreFilters[i]+'></button>');
        $(genreButton).text(displayFilters[i]);
        $(genreFilterGrid).append(genreButton)
    }
}

createGenreFilters();


