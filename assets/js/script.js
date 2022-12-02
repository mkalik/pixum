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

// actor = prompt('enter an actors name', '');
// getActor(actor);
var genre;
genre = prompt('enter a genre', '');
getGenre(genre);
function getGenre(type) {
    fetch(genre_imdbAPI + type)
        .then(function (data) {
            return data.json();
        })
        .then(function (results) {
            console.log(results);
        });
}

function getActor(name) {
    fetch(actor_imdbAPI + name)
        .then(function (data) {
            return data.json();
        })
        .then(function (results) {
            return results.results[0].id;
        })
        .then(function (nm_id) {
            fetch(name_imdbAPI + nm_id)
                .then(function (name_info) {
                    return name_info.json();
                })
                .then(function (info) {
                    console.log(info);
                    var movies = info.knownFor;
                    var known = {};
                    for (var i = 0; i < movies.length; i++) {
                        var id = movies[i].id;
                        var title = movies[i].title;
                        known[id] = title;
                    }
                    useData(known);
                });
        });
}

function useData(actor_movies) {
    id_title = actor_movies;
    var title_id = Object.keys(id_title)[0];
    fetch(movie_imdbAPI + title_id).then(function (data) {
        console.log(data.json());
    });
    console.log(id_title);
}

// const id_title = await getActor(actor);
// console.log(id_title);
// getGenre(genre);
