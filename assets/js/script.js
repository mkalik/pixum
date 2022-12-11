var genre_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21/?title_type=feature,tv_movie&genres=';
var length_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21?title_type=feature,tv_movie&moviemeter='; //comma separated numbers
var actor_imdbAPI = 'https://imdb-api.com/en/API/SearchName/k_gqv62f21/'; //requires an actors name
var name_imdbAPI = 'https://imdb-api.com/API/Name/k_gqv62f21/'; //requires imdbID
var movie_imdbAPI = 'https://imdb-api.com/en/API/Title/k_gqv62f21/';
var ratingsAPI = 'https://imdb-api.com/en/API/Ratings/k_gqv62f21/'; //requires imdbID

var search_type = 1; //1 = genre, 2 = actor , 3 = length

// SEARCH FILTERS
function goBookmark() {
    window.location.href = './assets/html/bookmark.html';
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
        hasSearched = false;
        $('#actor-search').hide();
        $('#length-search').hide();
        $('#genre-filter-grid').show();
        $('.separator').css('height', '180px');
    } else if (userSelection === 'Actor') {
        search_type = 2;
        hasSearched = false;
        $('#genre-filter-grid').hide();
        $('#length-search').hide();
        $('#actor-search').show();
        $('.separator').css('height', '60px');
    } else if (userSelection === 'Length') {
        search_type = 3;
        hasSearched = false;
        $('#genre-filter-grid').hide();
        $('#actor-search').hide();
        $('#length-search').show();
        $('.separator').css('height', '60px');
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
    changeSearchButtonText(event);
    console.log('click search');
    event.preventDefault();
    console.log(search_type);
    if (!hasSearched) {
        resultsArray = [];
        console.log('fetching');
        if (search_type === 1) {
            //genre search;
            hasSearched = true;
            getGenre();
        } else if (search_type === 2) {
            getActorID();
            //actor;
        } else if (search_type === 3) {
            //length
            verifyLengthInput();
        }
    } else {
        createResultCards();
    }
});

// CHANGE SEARCH BUTTON TEXT (Called in create blank results cards function)
function changeSearchButtonText(event) {
    var possibleText = [
        'just Pixum already! ',
        'forage those films ',
        'commence cinematic scouting ',
        'formulate films ',
        'SHOW ME THA MOVIES ',
        'perform silver screen scrutiny ',
    ];
    var searchButton = event.target;
    var randomButtonText = Math.floor(Math.random() * possibleText.length);
    $(searchButton).text(possibleText[randomButtonText]);
    $(searchButton).blur();
}

// CREATING SEARCH RESULTS

var searchResultContainer = $('#search-results-container');

function generateRandomMovies(moviesDisplay) {
    for (var i = 0; i < 4; i++) {
        var randomMovie = Math.floor(Math.random() * resultsArray.length);
        moviesDisplay.push(resultsArray[randomMovie]);
        if (search_type == 1) {
            resultsArray.splice(randomMovie, 1);
        }
    }
    return moviesDisplay;
}

function createResultCards(movies) {
    //creates cards that contain the movies the user searched for
    $('#search-button').removeClass('is-loading');
    console.log(movies);
    var moviesDisplay = [];
    if (search_type == 1) {
        if (typeof movies === 'undefined') {
            movies = resultsArray;
        }
        moviesDisplay = generateRandomMovies(moviesDisplay);
        console.log(moviesDisplay.length);
    } else if (search_type == 2) {
        moviesDisplay = movies;
    }
    var numberOfResults = moviesDisplay.length;
    console.log('num results: ' + numberOfResults);
    for (var i = 0; i < numberOfResults; i++) {
        var blankResultCard = $('<div class="blank-result-card"></div>');

        var moviePosterContainer = $(
            '<div class="movie-poster-container"></div>'
        );

        var movieIfNullPoster = moviesDisplay[i].image;
        if (movieIfNullPoster == null) {
            movieIfNullPoster = 'https://www.freeiconspng.com/img/25245';
        }
        var moviePoster = $(
            `<img src= ${movieIfNullPoster} class="movie-poster">`
        );

        moviePosterContainer.append(moviePoster);
        blankResultCard.append(moviePosterContainer);
        var bookmark = $(
            '<i class="fa-solid fa-bookmark" onclick="clickedBookmark(event)"></i>'
        );
        if (localStorage.getItem(moviesDisplay[i].id) != null) {
            $(bookmark).addClass('fa-bookmark-active');
        }
        blankResultCard.append(bookmark);

        var movieIfNullTitle = moviesDisplay[i].title;
        if (movieIfNullTitle == null) {
            movieIfNullTitle = '~Title~';
        }
        var movieTitle = $(
            `<h1 data-id= ${moviesDisplay[i].id} class= "movie-title">${movieIfNullTitle}</h1>`
        );
        blankResultCard.append(movieTitle);

        var movieIfNullRating = moviesDisplay[i].imDbRating;
        console.log(movieIfNullRating);
        console.log(typeof movieIfNullRating);
        if (movieIfNullRating == null) {
            movieIfNullRating = '0';
        }
        var movieRating = $(
            `<h3 class="movie-rating">${movieIfNullRating} <i class="fa-solid fa-star"></i></h3>`
        );
        blankResultCard.append(movieRating);

        var movietrailer = $(
            `<i class="${moviesDisplay[i].id} fa-regular fa-circle-play" ></i>`
        );
        console.log(movietrailer);
        blankResultCard.append(movietrailer);

        var moreInfoBtn = $(
            '<button class="more-info-button" onclick = "clickedMoreInfo(event)">More Info</button>'
        );
        blankResultCard.append(moreInfoBtn);

        $(blankResultCard).attr('data-result-index', i);

        searchResultContainer.append(blankResultCard);
    }
}

var movieObject = {};
// Add on hover to results cards
function clickedBookmark(event) {
    //adds some things to local storage when a user clicks on the little banner at the top right of movie posters
    console.log('click');
    var click = event.target;
    var clickParent = $(click).parent()[0];
    console.log(clickParent);

    var moviePoster = clickParent.children[0].children[0].currentSrc;
    console.log('movie poster;' + moviePoster);
    var movieTitle = clickParent.children[2].textContent;
    var movieID = clickParent.children[2].dataset.id;
    var movieRating = clickParent.children[3].textContent;

    console.log(
        'movieID: ' + movieID,
        '\ntitle: ' + movieTitle,
        '\nPoster: ' + moviePoster,
        '\nrating: ' + movieRating
    );

    movieObject = {
        movieID: movieID,
        title: movieTitle,
        poster: moviePoster,
        rating: movieRating,
    };

    if (localStorage.getItem(`${movieObject.movieID}`) === null) {
        localStorage.setItem(
            `${movieObject.movieID}`,
            JSON.stringify(movieObject)
        );
        $(click).addClass('fa-bookmark-active');

        console.log(
            'localstorage: ' + localStorage.getItem(`${movieObject.movieID}`)
        );
    } else {
        localStorage.removeItem(`${movieObject.movieID}`);
        $(click).removeClass('fa-bookmark-active');
        console.log(
            'localstorage: ' + localStorage.getItem(`${movieObject.movieID}`)
        );
    }
}

async function clickedMoreInfo(event) {
    var click = event.target;
    var clickParent = $(click).parent()[0];
    var movieID = clickParent.children[2].dataset.id;
    console.log('clicked moreinfo');
    let [title, urlresult] = await Promise.all([
        getMovie(movieID),
        getTrailer(movieID),
    ]);
    const [url, vidFound] = urlresult;
    if (vidFound != true) {
        title += ' Video Not Found';
    }
    createModal(url, title);
    //   console.log(results);
    //   getMovie(movieID).then(function (json) {
    //     console.log(json, "title for movie id");
    //   });
    //   getTrailer(movieID).then((trailer) => createModal(trailer));
}

async function getMovie(movieID) {
    const response = await fetch(
        `https://imdb-api.com/en/API/Title/k_gqv62f21/${movieID}`
    );
    const json = await response.json();
    return json.title;
}

function createModal(youtubeurl, title) {
    var modal = $('.modal-content');
    var modalContainer = $('.modal');
    $(modalContainer).removeClass('is-inactive').addClass('is-active');
    console.log('trailer');
    $('#Mod').html(title);
    $(modal).append(
        `<iframe id = 'embedVideo' width="560" height="315" src="${youtubeurl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    );
    console.log('creating modal');
}
function closeModal(event) {
    //closes the modal that contains the trailer
    var target = event.target;
    console.log(target);
    var modalContainer = $('.modal');
    $(modalContainer).removeClass('is-active').addClass('is-inactive');
    $('#embedVideo').remove();
}

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
        .then((movies) => createResultCards(movies));
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
        .then((knownFor) => createResultCards(knownFor));
}

function verifyLengthInput() {
    //this function should be looked over
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
        .then(function (movies) {
            resultsArray.push(...movies.results);
            createResultCards(movies.results);
        });
}

async function getTrailer(trailerID) {
    var trailerAPI = `https://api.themoviedb.org/3/movie/${trailerID}/videos?api_key=1af200ff906e604110980655841ecfbe&append_to_response=videos`;
    var response = await fetch(trailerAPI);
    var data = await response.json();
    console.log(trailerAPI, trailerID);

    if (data.results.length > 0) {
        return [`https://www.youtube.com/embed/${data.results[0].key}`, true];
    }
    return [`https://www.youtube.com/embed/D5XEeFV1Pc0`, false];
}

function getLength(length) {
    //calls imdb api and searches for movies with user specified length
    fetch(length_imdbAPI + length)
        .then((data) => data.json())
        .then(function (movies) {
            resultsArray.push(...movies.results);
            createResultCards(movies.results);
        });
}
//test function for modals
function createBlankRCT() {
    alert('hi!');
    //   const modalsContainer = document.getElementById("modals-container");
    //   movies.forEach(function (movie, index) {
    //     const modal = document.createElement("div");
    //      modal.classList.add("modal");
    //     modal.innerHTML = `
    //       <div class="modal-background"></div>
    //         <div class="modal-content has-background-white py-6 px-6">
    //           <h3 class="title mb-6">${movie.title}</h3>
    //           <h3 class="movie-rating">${movie.rating}</h3>
    //       <!-- <p class= "is-primary" >${movie.description}</p> -->
    //    </div> </div>  `;
    //     console.log("did it");
    //     openModal(modal);
    //     modalsContainer.append(modal);
    //   });
}
// $trigger.addEventListener('click', () => {
//     openModal($target);
//   });//test function for modals
