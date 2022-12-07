var genre_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21/?title_type=feature,tv_movie&genres=';
var length_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21?title_type=feature,tv_movie&moviemeter='; //comma separated numbers
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

function goBookmark() {

  window.location.replace("./assets/html/bookmark.html");
}

function goHome() {
  window.location.replace("../../index.html");

}

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
        hasSearched = false;
    } else if (userSelection === 'Actor') {
        search_type = 2;
        $('#genre-filter-grid').hide();
        $('#length-search').hide();
        $('#actor-search').show();
        $('.separator').css('height', '60px');
        hasSearched = false;
    } else if (userSelection === 'Length') {
        search_type = 3;
        $('#genre-filter-grid').hide();
        $('#actor-search').hide();
        $('#length-search').show();
        $('.separator').css('height', '60px');
        hasSearched = false;
    }

    $('.genre-button').attr('data-search', 'false');
    $('.genre-button').removeClass('genre-button-active');
    $('#actor-search').val('');
    $('#length-search').val('');
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
        'action,adventure,animation,biography,comedy,crime,documentary,drama,family,fantasy,film noir,history,horror,music,musical,mystery,news,romance,sci_fi,sport,thriller,war,western';
    var genreFilters = availableGenres.split(',');

    var displayedGenres =
        'action,adventure,animation,biography,comedy,crime,documentary,drama,family,fantasy,film noir,history,horror,music,musical,mystery,news,romance,sci fi,sport,thriller,war,western';
    var displayFilters = displayedGenres.split(',');

    for (var i = 0; i < genreFilters.length; i++) {
        var genreButton = $(
            `<button class="button is-rounded is-small column genre-button" data-search="false" data-genre=${genreFilters[i]}></button>`
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
        '<input id="length-search" class="input is-rounded actor-length-search" type="text" placeholder="minutes (eg. 120)">'
    );
}

// CLICK FUNCTION FOR GENRE BUTTONS
$('.genre-button').click(function (event) {
    var element = event.target;
    console.log(element);
    if (element.dataset.search === 'false') {
        element.dataset.search = 'true';
        $(element).addClass('genre-button-active');
    } else if (element.dataset.search === 'true') {
        element.dataset.search = 'false';
        $(element).removeClass('genre-button-active');
    }
    $(element).blur();
});

// SEARCH BUTTON

var hasSearched = false;
$('#search-button').click(function (event) {
    $(this).addClass('is-loading');
    console.log('click search');
    event.preventDefault();
    console.log(search_type);
    if (!hasSearched) {
        hasSearched = true;
        console.log('fetching');
        if (search_type === 1) {
            //genre search;
            getGenre();
        } else if (search_type === 2) {
            getActorID();
            //actor;
        } else if (search_type === 3) {
            //length
            verifyLengthInput();
        }
    } else {
        createBlankResultCards(event);
    }
});

// CHANGE SEARCH BUTTON TEXT (Called in create blank results cards function)
function changeSearchButtonText(event){
    var possibleText = ["just Pixum already! ", "let's go flix foraging ", "search far and wide ", "formulate films ", "SHOW ME THA MOVIES "];
    var button = event.target;
    var randomButtonText = Math.floor(Math.random() * possibleText.length);
    $(button).text(possibleText[randomButtonText]);
    $(button).blur();
}

// CREATING SEARCH RESULTS

var searchResultContainer = $('#search-results-container');
function generateRandomMovies() {
    var up;
    var down;
    var rest;
    down = Math.floor(Math.random() * resultsArray.length);
    if (4 >= resultsArray.length) {
        rest = 0;
        up = resultsArray.length - 1;
        down = 0;
    } else {
        rest = 4;
        up = down + rest;
    }
    return [down, up];
}


// function createBlankResultCards(movies) {

//     $('#search-button').removeClass('is-loading');
//     changeSearchButtonText(event);
//     console.log('log movies ' + movies);
//     if (typeof movies === 'undefined') {
//         console.log('copied');
//         movies = resultsArray;
//     }
//     console.log(movies); //probably want the title and image
//     var randslice = generateRandomMovies();
//     var moviesDisplay = movies.slice(randslice[0], randslice[1]);
//     console.log(moviesDisplay);
//     resultsArray.splice(randslice[0], randslice[1] - randslice[0]);
//     var numberOfResults = moviesDisplay.length;
//     for (var i = 0; i < numberOfResults; i++) {
//         var blankResultCard = $('<div class="blank-result-card"></div>');

//         var moviePoster = $(
//             `<img src= ${moviesDisplay[i].image} class="movie-poster">`
//         );
//         blankResultCard.append(moviePoster);

//         var bookmark = $('<i class="fa-solid fa-bookmark"></i>');
//         blankResultCard.append(bookmark);

//         var movieTitle = $(
//             `<h1 class= "movie-title">${moviesDisplay[i].title}</h1>`
//         );
//         blankResultCard.append(movieTitle);

//         var movieRating = $('<h3 class="movie-rating">Rating</h3>');
//         blankResultCard.append(movieRating);

//         var moreInfoBtn = $(
//             '<button class="more-info-button">More Info</button>'
//         );
//         blankResultCard.append(moreInfoBtn);

//         $(blankResultCard).attr('data-result-index', i);

//         searchResultContainer.append(blankResultCard);
//     }

// }

function createBlankResultCards(movies) {

    $('#search-button').removeClass('is-loading');
    console.log('log movies ' + movies);
    var numberOfResults = 4
    for (var i = 0; i < numberOfResults; i++) {
        var blankResultCard = $('<div class="blank-result-card"></div>');

        var moviePosterContainer = $('<div class=movie-poster-container></div>')
        var moviePoster = $(
        `<img class="movie-poster">`);
        moviePosterContainer.append(moviePoster);
        blankResultCard.append(moviePosterContainer);

        var bookmark = $('<i class="fa-solid fa-bookmark"></i>');
        blankResultCard.append(bookmark);

        var movieTitle = $(
            `<h1 class= "movie-title">Title</h1>`
        );
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

} createBlankResultCards();

// Add on hover to results cards

function addResultsHover(){
    if (document.querySelector("body > p:hover") != null) {
        console.log("hovered");
    }
}


//modals

// createBlankResultCards();


var resultsArray = [];
function getGenre() {
    //searches imdb api for movies with user specified genres
    var genreString = '';
    $('.genre-button').each(function () {
        //looks for all buttons that have been clicked and appends their genres to the genre string
        if ($(this).attr('data-search') == 'true') {
            genreString += $(this).attr('data-genre') + ',';
        }
    });
    genreString = genreString.substring(0, genreString.length - 1); //removes final comma
    console.log(genreString);
    fetch(genre_imdbAPI + genreString)
        .then((data) => data.json())
        .then(function (info) {
            console.log(info.results);
            resultsArray.push(...info.results);
            return info.results.slice(); //.slice(0, 4); //gets the results array from the api call and returns the first 4 results
        })
        .then((movies) => createBlankResultCards(movies));



}

//actor-search;
function getActorID() {
    //searches imdb api user inputted actor
    var name = $('#actor-search').val();
    console.log(name);
    fetch(actor_imdbAPI + name)
        .then((data) => data.json())
        .then(function (actorinfo) {
            var actorID = actorinfo.results[0].id;
            return actorID;
        })
        .then((actorID) => getKnownFor(actorID));
}
function getKnownFor(actorID) {
    //gets the actor id and fetches movies that the actor is known for
    console.log(actorID);
    fetch(name_imdbAPI + actorID)
        .then((info) => info.json())
        .then(function (actorInfo) {
            return actorInfo.knownFor;
        })
        .then((knownFor) => createBlankResultCards(knownFor));
}

function verifyLengthInput() {
    //verifies that user length input is a number
    var length = $('#length-search').val();
    if (length.indexOf(',') == -1) {
        if (!Number.isNaN(length)) {
            getLength(',' + length);
        } else {
            console.log('input is not a number');
        }
    } else if (length.indexOf(',')) {
        var limits = length.split(',');
        if (!Number.isNaN(limits[0]) && !Number.isNaN(limits[1])) {
            getLength(limits.join(','));
        } else {
            console.log('the limits are not both numbers');
        }
    }
}
function getLength(length) {
    //calls imdb api and searches for movies with user specified length
    fetch(length_imdbAPI + length)
        .then((data) => data.json())
        .then((movies) => console.log(movies));
}


$(".fa-bookmark").click(function (event) {
  $(".fa-bookmark").css("color", "white");

});
