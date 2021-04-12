const apiUrl =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const movieBtn = document.getElementById("movie");

function showMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      eventListGroupEl.html("");
      console.log(data);
      savedMovies = [];
      data.results.forEach((element, index) => {
        var eventData = createMovieObject(element);
        saveMovie(eventData);
        var output = `
                <div class="container border-black bg-gray movie-container">
                    <div><img src=${
                      IMGPATH + element.backdrop_path
                    } alt="img" /></div>
                    <div class="movie-info">
                        <p> Title: ${element.original_title}</p>
                        <p> Release date: ${element.release_date}</p>
                        <p> Rating: ${element.vote_average} <p>
                        <p> Description: ${element.overview}</p>
                        <label>
                            <input class='movie-checkbox'type='checkbox'><i class='form-icon'></i> Save movie for later
                        <label>
                    </div>
                </div>`;
        var movieBox = $("<div>").html(output);
        movieBox.appendTo(eventListGroupEl);
      });
      console.log(savedMovies);
    });
}

$("#movie").on("click", function (event) {
  console.log("movie button clicked");
  showMovies(apiUrl);
});
