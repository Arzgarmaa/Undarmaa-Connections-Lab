// ======================================================
// 1. API KEYS
// ======================================================

const OMDB_API_KEY = "51a73a4b";
const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODQ3YjcwODc3MjllZDY5ODgwNWIxZDdmODk0ODBjZiIsIm5iZiI6MTc5MDc3NzcyOC42ODk5OTk4LCJzdWIiOiI2YWJkMTk4MGExNTk0MDg2YzViOGZhYzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.stYNf3GgFEiYFx-emkRLOEJqh6m7rDRMMu1gd3XN5I4";


// ======================================================
// 2. FIND IMPORTANT HTML ELEMENTS
// ======================================================

const searchButton = document.querySelector("#searchbutton");
const searchInput = document.querySelector("#searchfilm");
const movieResult = document.querySelector("#mainfilminfo");


// ======================================================
// 3. LISTEN FOR USER INTERACTION
// ======================================================

// Search when the button is clicked
searchButton.addEventListener("click", function () {
    searchMovie();
});


// Search when Enter is pressed
searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchMovie();
    }

});


// ======================================================
// 4. SEARCH FOR THE MOVIE USING OMDb
// ======================================================

async function searchMovie() {

    const movieName = searchInput.value.trim();

    // Stop if the user didn't type anything
    if (movieName === "") {
        alert("Please enter a movie title.");
        return;
    }


    // Create the OMDb URL
    const omdbURL =
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movieName)}`;


    try {

        // Ask OMDb for the movie
        const response = await fetch(omdbURL);

        // Convert the response into JavaScript data
        const movie = await response.json();

        // Look at the returned data in the console
        console.log("OMDb data:");
        console.log(movie);


        // OMDb tells us if it could not find the movie
        if (movie.Response === "False") {
            alert("Movie not found.");
            return;
        }


        // Put the movie information on our webpage
        showMovie(movie);


        // Get recommendations from TMDB
        getRecommendations(movie.Title);

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong while searching for the movie.");

    }

}


// ======================================================
// 5. PUT OMDb MOVIE DATA INTO THE HTML
// ======================================================

function showMovie(movie) {

    // Make the movie result visible
    movieResult.style.display = "block";


    // Text information
    document.querySelector("#filmtitle").textContent = movie.Title;

    document.querySelector("#year").textContent = movie.Year;

    document.querySelector("#runtime").textContent = movie.Runtime;

    document.querySelector("#genre").textContent = movie.Genre;

    document.querySelector("#co").textContent = movie.Country;

    document.querySelector("#director").textContent = movie.Director;

    document.querySelector("#cast").textContent = movie.Actors;

    document.querySelector("#awards").textContent = movie.Awards;


    // Poster
    document.querySelector("#poster").src = movie.Poster;


    // Ratings
    showRatings(movie);

}


// ======================================================
// 6. GET THE RATINGS
// ======================================================

function showRatings(movie) {

    let imdb = "N/A";
    let rottenTomatoes = "N/A";
    let metacritic = "N/A";


    // IMDb
    if (movie.imdbRating !== "N/A") {

        imdb = movie.imdbRating + "/10";

    }


    // Metacritic
    if (movie.Metascore !== "N/A") {

        metacritic = movie.Metascore + "/100";

    }


    // Rotten Tomatoes
    const rottenRating = movie.Ratings.find(function (rating) {

        return rating.Source === "Rotten Tomatoes";

    });


    if (rottenRating) {

        rottenTomatoes = rottenRating.Value;

    }


    // Put ratings into HTML
    document.querySelector("#imdbrating").textContent = imdb;

    document.querySelector("#rottenrating").textContent = rottenTomatoes;

    document.querySelector("#metacriticrating").textContent = metacritic;

}


// ======================================================
// 7. SEARCH TMDB FOR RECOMMENDATIONS
// ======================================================

async function getRecommendations(movieTitle) {

    // First search TMDB for the movie
    const searchURL =
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieTitle)}`;


    try {

        const searchResponse = await fetch(searchURL, {

            headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`
            }

        });


        const searchData = await searchResponse.json();


        // Inspect TMDB's response
        console.log("TMDB search data:");
        console.log(searchData);


        // Stop if TMDB couldn't find the movie
        if (searchData.results.length === 0) {

            showNoRecommendations();

            return;

        }


        // Get the ID of the first movie result
        const movieID = searchData.results[0].id;


        // Use that ID to ask TMDB for recommendations
        const recommendationURL =
            `https://api.themoviedb.org/3/movie/${movieID}/recommendations`;


        const recommendationResponse = await fetch(recommendationURL, {

            headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`
            }

        });


        const recommendationData =
            await recommendationResponse.json();


        // Inspect recommendation data
        console.log("TMDB recommendation data:");
        console.log(recommendationData);


        // Take only the first 3 recommendations
        const recommendations =
            recommendationData.results.slice(0, 3);


        // Display them
        showRecommendations(recommendations);

    }

    catch (error) {

        console.log(error);

        showNoRecommendations();

    }

}


// ======================================================
// 8. CREATE THE RECOMMENDATION ELEMENTS
// ======================================================

function showRecommendations(recommendations) {

    const recommendationList =
        document.querySelector("#reclist");


    // Remove recommendations from the previous search
    recommendationList.innerHTML = "";


    // If TMDB returned nothing
    if (recommendations.length === 0) {

        showNoRecommendations();

        return;

    }


    // Go through each recommended movie
    recommendations.forEach(function (movie) {

        // Create a new div
        const recommendation =
            document.createElement("div");


        // Give it the CSS class we created
        recommendation.classList.add("recommendation");


        // Put the movie title inside
        recommendation.textContent = movie.title;


        // Put the new div inside #reclist
        recommendationList.appendChild(recommendation);

    });

}


// ======================================================
// 9. IF THERE ARE NO RECOMMENDATIONS
// ======================================================

function showNoRecommendations() {

    const recommendationList =
        document.querySelector("#reclist");


    recommendationList.innerHTML =
        "<p>No recommendations available.</p>";

}