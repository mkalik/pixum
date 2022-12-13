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
    //redirects a user to the bookmarks page
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
        //following two lines indicate a search type and whether or not to ping an api again.
        search_type = 1;
        hasSearched = false;
        $('#actor-search').hide();
        $('#length-search').hide();
        $('#genre-filter-grid').css('height', '1px');
        $('#genre-filter-grid').css('opacity', '0');
        $('#genre-filter-grid').show();
        setTimeout(function () {
            $('#genre-filter-grid').css('height', 'auto');
            $('#genre-filter-grid').css('opacity', '1');
        }, 500);
        $('.separator').css('height', '180px');
    } else if (userSelection === 'Actor') {
        //see line 31
        search_type = 2;
        hasSearched = false;
        $('#genre-filter-grid').hide();
        $('#length-search').hide();
        $('#actor-search').show();
        $('.separator').css('height', '60px');
        $('.show-more-container').css('display', 'none');
    } 
    // else if (userSelection === 'Length') {
    //     search_type = 3;
    //     hasSearched = false;
    //     $('#genre-filter-grid').hide();
    //     $('#actor-search').hide();
    //     $('#length-search').show();
    //     $('.separator').css('height', '60px');
    //     $('.show-more-container').css('display', 'none');
    // }

    $('.genre-button').attr('data-search', 'false');
    $('.genre-button').removeClass('genre-button-active');
    $('#actor-search').val('');
    $('#length-search').val('');

    setTimeout(function () {
        changeSearchButtonText();
    }, 50);
});

// FINDS THE MAIN DIV CONTAINING THE SPECIFIC FILTERS
var searchFilterContainer = $('.search-filter-container');

// LOADS IN ALL OF THE FILTERS FOR EACH MAIN FILTER. DEFAULT TO GENRE SHOWN.
function loadSearchFilters() {
    //loads everything on the page
    createGenreFilters();
    createActorFilters();
    // createLengthFilters();
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
    //adds a text input field to the page that allows for a user to input an actors name
    $(searchFilterContainer).append(
        '<input id="actor-search" class="input is-rounded actor-length-search" type="text" placeholder="Adam Sandler">'
    );
}

// CREATE LENGTH INPUT
// ended up not including this as it wasnt a very good search criteria
// function createLengthFilters() {
//     $(searchFilterContainer).append(
//         '<input id="length-search" class="input is-rounded actor-length-search" type="text" placeholder="minutes (eg. 120)">'
//     );
// }

// CLICK FUNCTION FOR GENRE BUTTONS
$('.genre-button').click(function (event) {
    //this function is used in combination with the actual genreSearch api call. It determines which button was clicked and adds an attribute that lets the 
    //function know which genres to search for. It also allows for a user to click again to remove a genre
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

var hasSearched = false;//this was for the showmore button. Instead of pinging an api multiple times, it allows for quick population of a page with more results
$('#actor-search').keydown(function (event) {
    console.log('hello');
    if (event.keyCode == 13) {
        if ($('#actor-search').val() === '') {
            $('#errorModal').removeClass('is-inactive').addClass('is-active');
            $('#errorModalContent').append(
                '<p id="errorMessage">ERROR: Please enter an actors name</p>'
            );
        } else {
            $('#search-button').addClass('is-loading');
            console.log(event.target);
            getActorID();
        }
    }
});

$('#search-button').click(function (event) {
    //the actual search button on the page. Changes looks based on if a fetch call is being made or not.
    $(this).addClass('is-loading');
    console.log('click search');
    event.preventDefault();
    console.log(search_type);
    if (!hasSearched) {
        //this array stores all of the results from a genre search and allows for quick population of more movies on a page
        resultsArray = [];
        console.log('fetching');
        if (search_type === 1) {
            //genre search;
            hasSearched = true;//again allows for quick population of a page.
            getGenre();
            $('.show-more-container').css('display', 'flex');
        } else if (search_type === 2) {
            if ($('#actor-search').val() === '') {//error checks. Makes sure that a user doesnt have a blank input field when searching for an actor
                $(this).removeClass('is-loading');
                $('#errorModal')
                    .removeClass('is-inactive')
                    .addClass('is-active');
                $('#errorModalContent').append(
                    '<p id="errorMessage">ERROR: Please enter an actors name</p>'
                );
            } else {
                $('#search-button').addClass('is-loading');//if  the input is looking good then the api is called.
                console.log(event.target);
                getActorID();
            }
            // $('.show-more-container').css('display', 'none');
            //actor;
        } else if (search_type === 3) {
            //length
            verifyLengthInput();
            // $('.show-more-container').css('display', 'none');
        }
    } else {
        createResultCards();
    }
});

// CHANGE SEARCH BUTTON TEXT (called when the user changes the main search criteria dropown)
function changeSearchButtonText() {
    var searchButton = $('#search-button');
    var possibleText = [
        'Just Pixum Already! ',
        'Forage for Films ',
        'Collect Cinema Commendations ',
        'Formulate Films ',
        'SHOW ME THA MOVIES! ',
        'Search the Silver Screen ',
    ];
    var randomButtonText = Math.floor(Math.random() * possibleText.length);
    $(searchButton).text(possibleText[randomButtonText]);
    $(searchButton).append(
        $('<i class="fa-solid fa-magnifying-glass search-icon"></i>')
    );
}

// CREATING SEARCH RESULTS

var searchResultContainer = $('#search-results-container');

function generateRandomMovies(moviesDisplay) {
    //random displays movies when a genre search happens so that the same results dont populate the page every time.
    for (var i = 0; i < 4; i++) {
        var randomMovie = Math.floor(Math.random() * resultsArray.length);
        moviesDisplay.push(resultsArray[randomMovie]);
        if (search_type == 1) {
            resultsArray.splice(randomMovie, 1);
        }
    }
}

function createResultCards(movies) {
    //creates cards that contain the movies the user searched for
    $('#search-button').removeClass('is-loading');
    $('#actor-search').val('');
    $('#search-button').blur();
    $('footer').css('position', 'relative');
    $('footer').css('bottom', '0px');
    console.log(movies);
    var moviesDisplay = [];
    if (search_type == 1) {
        if (typeof movies === 'undefined') {
            movies = resultsArray;
        }
        generateRandomMovies(moviesDisplay);
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
            '<i class="fa-solid fa-bookmark results-card-bookmark" onclick="clickedBookmark(event)"></i>'
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
            movieIfNullRating = '';
        }
        var movieRating = $(
            `<h3 class="movie-rating">${movieIfNullRating} <i class="fa-solid fa-star"></i></h3>`
        );
        blankResultCard.append(movieRating);

        var moreInfoBtn = $(
            '<button class="more-info-button" onclick = "clickedMoreInfo(event)">More Info<i class="${moviesDisplay[i].id} fa-regular fa-circle-play" ></i></button>'
        );
        blankResultCard.append(moreInfoBtn);

        $(blankResultCard).attr('data-result-index', i);

        searchResultContainer.append(blankResultCard);
    }
}

var movieObject = {};//the object that gets stored locally.
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

    movieObject = {//the actual movie object added to local storage
        movieID: movieID,
        title: movieTitle,
        poster: moviePoster,
        rating: movieRating,
    };

    if (localStorage.getItem(`${movieObject.movieID}`) === null) {//where things are put into local storage
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

async function clickedMoreInfo(event) {//a listener for the moreinfo portion of a movie tile. This function calls the movie trailer api adds them to the popup modal
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

    getallinfo(movieID).then(returnValue => 
      $(`.modal-content`).append(returnValue)
    )

    getdescription(movieID).then(returnValue => 
      $(`.modal-content`).append(`<p class='movieplot'>${returnValue}</p>`)
    )
    
    setTimeout(function(){
      getstreams(movieID).then(returnValue => 
        $(`.modal-content`).append(`<div class='streams'><a href='${returnValue}' target='_blank' class='rent-option'>Watch Options</a></div>`)
      )
    },1000);
    
 
    //   console.log(results);
    //   getMovie(movieID).then(function (json) {

    //     console.log(json, "title for movie id");
    //   });
    //   getTrailer(movieID).then((trailer) => createModal(trailer));
}

async function getMovie(movieID) {//gets a movie based on a movie id
    const response = await fetch(
        `https://imdb-api.com/en/API/Title/k_gqv62f21/${movieID}`
    );
    const json = await response.json();
    console.log(json);
    return json.title;
}

async function getdescription(movieID) {//gets a description for a movie
    const response = await fetch(
        `https://imdb-api.com/en/API/Title/k_gqv62f21/${movieID}`
    );
    const json = await response.json();
    console.log(json);
    return json.plot;
}

async function getallinfo(movieID) {//gets all of the info for a movie
    const response = await fetch(
        `https://imdb-api.com/en/API/Title/k_gqv62f21/${movieID}`
    );
    const json = await response.json();
    console.log(json);
    var allinfo = $(`<div class='info'></div>`);
    //metacritic rating
    if (!json.metacriticRating) {
        allinfo.append(`<p class='metacritic'>(No current score)</p>`);
    } else {
        allinfo.append(
            `<p class='metacritic'><i class="fa-solid fa-star fa-color"></i> ${json.metacriticRating}% </p>`
        );
    }
    //run time
    allinfo.append(`<p class='runtime'>${json.runtimeStr}</p>`);
    //rating
    allinfo.append(`<p class='rating'>${json.contentRating}</p>`);
    //release year
    allinfo.append(`<p class='year'>(${json.year})</p>`);
    console.log(allinfo);
    return allinfo;
}

async function getstreams(movieID) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=1af200ff906e604110980655841ecfbe`
    );
    const json = await response.json();
    var link = $(`link`);
    if (!json.results['US']) {
        return 'Not yet avaliable for rent';
    } else {
        return json.results['US'].link;
    }
}

async function getyear(movieID) {
    const response = await fetch(
        `https://imdb-api.com/en/API/Title/k_gqv62f21/${movieID}`
    );
    const json = await response.json();
    console.log(json);
    return json.plot;
}
/*function getdescription(movieID) {
  fetch(`https://imdb-api.com/en/API/Title/k_gqv62f21/${movieID}`)
        .then((data) => data.json())
        .then(function (info) {
          console.log(info.plot)
            return info;
        })
}
*/
function createModal(youtubeurl, title) {
    var modal = $('#moreInfoContent');
    var modalContainer = $('#moreInfoModal');
    $(modalContainer).removeClass('is-inactive').addClass('is-active');
    console.log('trailer');
    $('#Mod').html(title);
    $(modal).append(
        `<iframe class = 'youtubevid' id = 'embedVideo' width="560" height="315" src="${youtubeurl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    );
    console.log('creating modal');
}
function closeErrorModal(event) {//closes an error modal.
    var target = event.target;
    console.log(target);
    var modalContainer = $('#errorModal');
    $('#errorMessage').remove();
    $(modalContainer).removeClass('is-active').addClass('is-inactive');
}
function closeModal(event) {//closes a moreinfo modal
    //closes the modal that contains the trailer
    var target = event.target;
    console.log(target);
    var modalContainer = $('#moreInfoModal');
    $(modalContainer).removeClass('is-active').addClass('is-inactive');
    $('#embedVideo').remove();
    $('.movieplot').remove();
    $('.info').remove();
    $('.streams').remove();
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
            console.log(actorinfo);
            if (actorinfo.results.length == 0) {//error checking
                $('#errorModal')
                    .addClass('is-active')
                    .removeClass('is-inactive');
                $('#errorModalContent').append(
                    `<p id = "errorMessage"> ERROR: <br> we couldnt find-${name}, please make sure youve spelled it correctly!</p>`
                );
                var errorID = 'error';
                return errorID;
            } else {
                var actorID = actorinfo.results[0].id;

                return actorID;
            }
        })
        .then((actorID) => getKnownFor(actorID));
}

function getKnownFor(actorID) {
    //gets the actor id and fetches movies that the actor is known for
    if (actorID != 'error') {
        console.log(actorID);
        fetch(name_imdbAPI + actorID)
            .then((info) => info.json())
            .then(function (actorInfo) {
                return actorInfo.knownFor;
            })
            .then((knownFor) => createResultCards(knownFor));
    } else {
        $('#search-button').removeClass('is-loading');
        $('#actor-search').val('');
        hasSearched == false;
    }
}
//not actually used.
//function verifyLengthInput() {
//    //this function should be looked over
//    //verifies that user length input is a number
//    var length = $('#length-search').val();
//    if (length.indexOf(',') == -1) {
//        if (!Number.isNaN(length)) {
//            getLength(',' + length);
//        } else {
//            console.log('input is not a number');
//        }
//    } else if (length.indexOf(',')) {
//        var limits = length.split(',');
//        if (!Number.isNaN(limits[0]) && !Number.isNaN(limits[1])) {
//            getLength(limits.join(','));
//        } else {
//            console.log('the limits are not both numbers');
//        }
//    }
//}

var errorMovies = {//an array to display if something doesnt get returned from a fetch call correctly.
    image: '../images/errorImage.png',
    title: 'couldnt fetch this title',
    imdbRating: 'couldnt fetch this movie',
    id: null,
};
//function getLength(length) {//not used but would get the results from a length search
//    //calls imdb api and searches for movies with user specified length
//    fetch(length_imdbAPI + length)
//        .then((data) => data.json())
//        .then(function (movies) {
//            resultsArray.push(...movies.results);
//            createResultCards(movies.results);
//        })
//        .catch(function () {
//            var i = 0;
//            while (i < 4) {
//                resultsArray.push(errorMovies);
//                i++;
//            }
//            createResultCards(resultsArray);
//        });
//}

async function getTrailer(trailerID) {
    var trailerAPI = `https://api.themoviedb.org/3/movie/${trailerID}/videos?api_key=1af200ff906e604110980655841ecfbe&append_to_response=videos`;
    var response = await fetch(trailerAPI);
    var data = await response.json();
    console.log(trailerAPI, trailerID);
    console.log(data);
    for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].name === 'Official Trailer') {
            return [
                `https://www.youtube.com/embed/${data.results[i].key}`,
                true,
            ];
        } else if (data.results[i].name.includes('Trailer')) {
            return [
                `https://www.youtube.com/embed/${data.results[i].key}`,
                true,
            ];
        } else if (data.results[i].name.includes('Teaser')) {
            return [
                `https://www.youtube.com/embed/${data.results[i].key}`,
                true,
            ];
        }
    }
}

//test function for modals
// function createBlankRCT() {
    // alert('hi!');
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
// }
// $trigger.addEventListener('click', () => {
//     openModal($target);
//   });//test function for modals
