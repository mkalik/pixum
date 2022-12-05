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

// const id_title = await getActor(actor);
// console.log(id_title);
// getGenre(genre);
