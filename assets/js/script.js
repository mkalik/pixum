var genre_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21/?genres=';
var length_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21?moviemeter='; //comma separated numbers
var actor;
var actor_imdbAPI = 'https://imdb-api.com/en/API/SearchName/k_gqv62f21/'; //requires an actors name
var name_imdbAPI = 'https://imdb-api.com/API/Name/k_gqv62f21/'; //requires imdbID
var movie_imdbAPI = 'https://imdb-api.com/en/API/Title/k_gqv62f21/';
var imdbID;
var watchAPI =
    'https://api.watchmode.com/v1/' +
    imdbID +
    '/345534/sources/?apiKey=VdPS48VbVT9u5JoyVOSjCyMC8zbheghplfqA9HX9/'; //title must be defined, should used imdbID.
var omdbAPI = 'http://www.omdbapi.com/?i=tt3896198&apikey=c4ce22ab'; //might not even be used
var ratingsAPI = 'https://imdb-api.com/en/API/Ratings/k_gqv62f21/'; //requires imdbID

var id_title = {};
var json_actor;
var actorInfo = document.querySelector('.actor-info');

actor = prompt('enter an actors name', '');
getActorID(actor);
var genre;
// genre = prompt('enter a genre', '');
// getGenre(genre);
function getGenre(type) {
    fetch(genre_imdbAPI + type).then(function (data) {
        return data.json();
    });
    // .then(function (results) {
    //     console.log(results);
    // });
}

function getActorID(name) {
    fetch(actor_imdbAPI + name)
        .then(function (data) {
            return data.json();
        })
        .then(function (results) {
            return results.results[0].id;
        })
        .then(function (nm_id) {
            knownFor(nm_id);
        });
}
function knownFor(name) {
    fetch(name_imdbAPI + name)
        .then(function (name_info) {
            return name_info.json();
        })
        .then(function (info) {
            // var movies = info.knownFor;
            // var known = {};
            // for (var i = 0; i < movies.length; i++) {
            //     var id = movies[i].id;
            //     var title = movies[i].title;
            //     known[id] = title;
            // }
            // useData(name, known);
            actor_card(info);
        });
}
function actor_card(info) {
    var knownfor = info.knownFor;
    console.log(knownfor);
    document.querySelector('.actor-pic').src = info.image;
    document.querySelector('#actor-name').textContent = info.name;
    console.log(info.name + '-' + info.image);

    // document.querySelector('.movie-1').src = knownfor[0].image;
    for (var i = 0; i < knownfor.length; i++) {
        var movie = '.movie-' + (i + 1);
        document.querySelector(movie).src = knownfor[i].image;
        console.log(movie);
    }
    return;
}

function useData(name, actor_movies) {
    id_title = actor_movies;
    // var actor_movies = {};
    // var title_id = Object.keys(id_title)[0];
    console.log(id_title);
    actor_card(id_title);
}

// const id_title = await getActor(actor);
// console.log(id_title);
// getGenre(genre);
