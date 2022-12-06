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


var search_type = 1; //1 = genre, 2 = actor , 3 = length



// SEARCH FILTERS

// CLICK FUNCTION FOR THE MAIN FILTER (GENRE, ACTOR, LENGTH)

$('#search-filter-dropdown').click(function (event) {
    //function for the genre dropdown menu
    var element = event.target;
    var selectedFilter = $('#selected-filter');
    var userSelection = $(element).text();

    setTimeout(function () {
        $(selectedFilter).text(userSelection);
    }, 50);

    if (userSelection === 'Genre') {
        search_type = 1;
        $('#actor-search').hide();
        $('#length-search').hide();
        $('#genre-filter-grid').show();
        $('.separator').css('height', '180px');
    } else if (userSelection === 'Actor') {
        search_type = 2;
        $('#genre-filter-grid').hide();
        $('#length-search').hide();
        $('#actor-search').show();
        $('.separator').css('height', '60px');
    } else if (userSelection === 'Length') {
        search_type = 3;
        $('#genre-filter-grid').hide();
        $('#actor-search').hide();
        $('#length-search').show();
        $('.separator').css('height', '60px');
    }

    $('.genre-button').attr('data-search', 'false');
    $('.genre-button').removeClass('genre-button-active');
    $('#actor-search').val("");  
    $('#length-search').val("");

});

// FINDS THE MAIN DIV CONTAINING THE SPECIFIC FILTERS
var searchFilterContainer = $('.search-filter-container');

// LOADS IN ALL OF THE FILTERS FOR EACH MAIN FILTER. DEFAULT TO GENRE SHOWN.
function loadSearchFilters() {
    //loads everything on the page
    createGenreFilters();
    createActorFilters();
    createLengthFilters();
    $('#actor-search').hide();
    $('#length-search').hide();
}

loadSearchFilters();

// CREATE GENRE BUTTON GRID
function createGenreFilters() {
    //creates a grid of buttons with genres
    var genreFilterGrid = $(
        '<div id="genre-filter-grid" class="columns is-multiline"></div>'
    );
    $(searchFilterContainer).append(genreFilterGrid);
    var availableGenres =
        'action,adventure,animation,biography,comedy,crime,documentary,drama,family,fantasy,film noir,game_show,history,horror,music,musical,mystery,news,reality tv,romance,sci_fi,sport,talk show,thriller,war,western';
    var genreFilters = availableGenres.split(',');

    var displayedGenres =
        'action,adventure,animation,biography,comedy,crime,documentary,drama,family,fantasy,film noir,game show,history,horror,music,musical,mystery,news,reality tv,romance,sci fi,sport,talk show,thriller,war,western';
    var displayFilters = displayedGenres.split(',');

    for (var i = 0; i < genreFilters.length; i++) {
        var genreButton = $(
            '<button class="button is-rounded is-small column genre-button" data-search="false" data-genre=' +
                genreFilters[i] +
                '></button>'
        );
        $(genreButton).text(displayFilters[i]);
        $(genreFilterGrid).append(genreButton);
    }
}

// CREATE ACTOR NAME INPUT
function createActorFilters() {
    $(searchFilterContainer).append(
        '<input id="actor-search" class="input is-rounded actor-length-search" type="text" placeholder="Adam Sandler">'
    );
}

// CREATE LENGTH INPUT
function createLengthFilters() {
    $(searchFilterContainer).append(
        '<input id="length-search" class="input is-rounded actor-length-search" type="text" placeholder="minutes(eg. 120)">'
    );
}

// CLICK FUNCTION FOR GENRE BUTTONS
$('.genre-button').click(function (event) {
    var element = event.target;
    console.log(element);
    if (element.dataset.search === 'false') {
        element.dataset.search = 'true';
        $(element).addClass('genre-button-active')
    } else if (element.dataset.search === 'true') {
        element.dataset.search = 'false';
        $(element).removeClass('genre-button-active')
    }
    $(element).blur();
});


// SEARCH BUTTON

$('#search-button').click(function (event) {
    console.log('click search');
    event.preventDefault();
    console.log(search_type);
    if (search_type === 1) {
        //genre search;
        getGenre();
    } else if (search_type === 2) {
        //actor;
    } else if (search_type === 3) {
        //length
    }
});


// CREATING SEARCH RESULTS

var searchResultContainer = $('#search-results-container');

function createBlankResultCards() {
    var numberOfResults = 4;
    for (var i = 0; i < numberOfResults; i++) {
        var blankResultCard = $('<div class="blank-result-card"></div>');

        var moviePoster = $('<img class="movie-poster">');
        blankResultCard.append(moviePoster);

        var movieTitle = $('<h1 class= "movie-title">Title</h1>');
        blankResultCard.append(movieTitle);

        var movieRating = $('<h3 class="movie-rating">Rating</h3>');
        blankResultCard.append(movieRating);

        var moreInfoBtn = $(
            '<button class="more-info-button">More Info</button>'
        );
        blankResultCard.append(moreInfoBtn);

        $(blankResultCard).attr('data-result-index', i);

        searchResultContainer.append(blankResultCard);
    }
}

createBlankResultCards();

var id_title = {};
var json_actor;
var actorInfo = document.querySelector('.actor-info');

function getGenre() {
    var genreString = '';
    var genresSearch = Array.from(
        document.querySelector('#genre-filter-grid').children
    );
    console.log(genresSearch);
    for (var x = 0; x < genresSearch.length; x++) {
        if (genresSearch[x].dataset.search == 'true') {
            if (genreString.size != 0) {
                genreString += genresSearch[x].dataset.genre;
                genreString += ',';
            }
        }
    }
    genreString = genreString.substring(0, genreString.length - 1);
    console.log(genreString);
    console.log('fetch');
    fetch(genre_imdbAPI + genreString)
        .then((data) => data.json())
        .then(function (info) {
            console.log(info);
            return info;
        })
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
