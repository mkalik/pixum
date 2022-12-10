// var bookmarkResultContainer = $('#bookmark-result-container');

function goHome() {
    window.location.replace('../../index.html');
}

function createBookmarkCards() {
    if (localStorage.length === 0){
        window.alert("You have not bookmarked any movies yet! Pixum!");
        return;
    }
    
    var localItems = [];

// for loop getting keys into this array
    for (var i = 0; i < localStorage.length; i++) {
    localItems.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    console.log(localItems)
    // for loop that looks through each index of the array, uses the key at that index
    // to grab the object from local storage, creates things using the objects values

    for (i=0; i < localItems.length; i++){

        var bookmarkedMovie = localItems[i]
    
        var blankResultCard = $('<div class="blank-result-card"></div>');

        var moviePosterContainer = $(
            '<div class="movie-poster-container"></div>'
        );
        var moviePoster = $(
            `<img src= ${bookmarkedMovie.poster} class="movie-poster">`
        );
        moviePosterContainer.append(moviePoster);
        blankResultCard.append(moviePosterContainer);

        var bookmark = $(
            '<i class="fa-solid fa-bookmark" onclick="clickedBookmark(event)"></i>'
        );
        blankResultCard.append(bookmark);

        var movieTitle = $(
            `<h1 data-id= ${bookmarkedMovie.movieID} class= "movie-title">${bookmarkedMovie.title}</h1>`
        );
        blankResultCard.append(movieTitle);

        var movieRating = $(
            `<h3 class="movie-rating">${bookmarkedMovie.rating} <i class="fa-solid fa-star"></i></h3>`
        );
        blankResultCard.append(movieRating);

        var movietrailer = $(
            `<i class="${bookmarkedMovie.movieID} fa-regular fa-circle-play" ></i>`
        );
        blankResultCard.append(movietrailer);

        var moreInfoBtn = $(
            '<button class="more-info-button" onclick = "clickedMoreInfo(event)" >More Info</button>'
        );
        blankResultCard.append(moreInfoBtn);

        $(blankResultCard).attr('data-result-index', i);

        $('#bookmark-results-container').append(blankResultCard);
    }
}

createBookmarkCards();