// var bookmarkResultContainer = $('#bookmark-result-container');

function goHome() {
    window.location.replace('../../index.html');
}

var localItems = [];
for (var i = 0; i < localStorage.length; i++) {
    localItems.push(localStorage.getItem(localStorage.key(i)));
}
console.log(localItems);
// function createBookmarkCards(movies) {
//     var moviesDisplay = movies;
//     console.log(moviesDisplay);
//     var numberOfResults = moviesDisplay.length;
//     for (var i = 0; i < numberOfResults; i++) {
//         console.log(moviesDisplay[i].id);
//         var blankResultCard = $('<div class="blank-result-card"></div>');

//         var moviePosterContainer = $(
//             '<div class="movie-poster-container"></div>'
//         );
//         var moviePoster = $(
//             `<img src= ${moviesDisplay[i].image} class="movie-poster">`
//         );
//         moviePosterContainer.append(moviePoster);
//         blankResultCard.append(moviePosterContainer);

//         var bookmark = $(
//             '<i class="fa-solid fa-bookmark" onclick="clickedBookmark(event)"></i>'
//         );
//         blankResultCard.append(bookmark);

//         var movieTitle = $(
//             `<h1 data-id= ${moviesDisplay[i].id} class= "movie-title">${moviesDisplay[i].title}</h1>`
//         );
//         blankResultCard.append(movieTitle);

//         var movieRating = $(
//             `<h3 class="movie-rating">${movies[i].imDbRating} <i class="fa-solid fa-star"></i></h3>`
//         );
//         blankResultCard.append(movieRating);

//         var movietrailer = $(
//             `<i class="${movies[i].id} fa-regular fa-circle-play" ></i>`
//         );
//         console.log(movietrailer);
//         blankResultCard.append(movietrailer);

//         var moreInfoBtn = $(
//             '<button class="more-info-button" onclick = "clickedMoreInfo(event)" >More Info</button>'
//         );
//         blankResultCard.append(moreInfoBtn);

//         $(blankResultCard).attr('data-result-index', i);

//         bookmarkResultContainer.append(blankResultCard);
//     }
// }

// async function getTrailer(trailerID) {
//     var trailerAPI = `https://api.themoviedb.org/3/movie/${trailerID}/videos?api_key=1af200ff906e604110980655841ecfbe&append_to_response=videos`;
//     var trailer = await fetch(trailerAPI)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             var trailerkey = `https://www.youtube.com/watch?v=${data.results[0].key}`;
//             console.log(trailerkey);
//             return trailerkey;
//         });
//     return trailer;
// }

// createBookmarkCards();
