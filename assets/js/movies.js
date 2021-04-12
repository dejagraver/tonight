const apiUrl =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const movieBtn = document.getElementById("movie");

// showMovies(apiUrl);
function showMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      data.results.forEach((element) => {
        console.log(data);

        let output = `
            <div>
                <div><img src=${
                  IMGPATH + element.backdrop_path
                } alt="img" /></div>
                <div class="movie-info">
                    <p> Title: ${element.original_title}</p>
                    <p> Release date: ${element.release_date}</p>
                    <p> Rating: ${element.vote_average} <p>
                    <p> Description: ${element.overview}</p>
                    <label>
                        <input type="checkbox" />
                        Add Movie
                    <label>
                </div>
            </div>
        `;
        search.innerHTML += output;
      });
    });
}

movieBtn.addEventListener("click", () => showMovies(apiUrl));

// const savedListBtn = document.querySelector("#show-saved-list")
// const searchList = document.getElementById("search");
// const data = JSON.parse(localStorage.getItem("savedList"))
// const events = data.events

// const filtered = events.filter(i => i !== null) //filter items in the array that are null

// savedListBtn.addEventListener("click", () => {
//    filtered.forEach(event => {
//     let output = `
//         <div>
//             <div class="movie-info">
//                 <p> Title: ${event?.name}</p>
//                 <p> Release date: ${event?.date}</p>
//                 <p> Rating: ${event?.time} <p>
//                 <p> Description: ${event?.url}</p>
//             </div>
//         </div>
//     `;
//     search.innerHTML += output
//    })
// })
