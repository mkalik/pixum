var genre = [];
var genre_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21/?genres='; //comma separated values
var length_imdbAPI =
    'https://imdb-api.com/API/AdvancedSearch/k_gqv62f21?moviemeter='; //comma separated numbers
var actor;
var actor_imdbAPI = 'https://imdb-api.com/en/API/SearchName/k_gqv62f21/'; //requires an actors name
var name_imdbAPI = 'https://imdb-api.com/API/Name/k_gqv62f21/';
var imdbID;
var watchAPI =
    'https://api.watchmode.com/v1/' +
    imdbID +
    '/345534/sources/?apiKey=VdPS48VbVT9u5JoyVOSjCyMC8zbheghplfqA9HX9/'; //title must be defined, should used imdbID.
var omdbAPI = 'http://www.omdbapi.com/?i=tt3896198&apikey=c4ce22ab'; //might not even be used
var ratingsAPI = 'https://imdb-api.com/en/API/Ratings/k_gqv62f21/'; //requires imdbID

var id_name = [];

actor = prompt('Enter an actors name', '');
if (actor != null) {
    actorMovies(actor);
}

function actorMovies(actor) {
    var data = [];
    fetch(actor_imdbAPI + actor)
        .then(function (response) {
            if (response.ok) {
                console.log(response.status);
                console.log(response.headers);
            }
            return response.json();
        })
        .then(function (info) {
            console.log(info.results[0].id);
            fetch;
            return info.results[0].id;
        })
        .then(function (info) {
            fetch(name_imdbAPI + info)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then(function (info) {
                    console.log(info);
                    for (var i = 0; i < info.knownFor.length; i++) {
                        var movie_nm = String(info.knownFor[i].id);
                        var movie_title = String(info.knownFor[i].title);
                        var nm_title = {};
                        nm_title[movie_nm] = movie_title;
                        console.log(nm_title);
                        data.push(nm_title);
                    }
                    return;
                });
        });
    console.log(data);
    return;
}
