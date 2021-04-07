const apiUrl = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const movieBtn = document.getElementById("movie-btn")



// showMovies(apiUrl);
function showMovies(url){
    fetch(url).then(res => res.json())
    .then(function(data){
    data.results.forEach(element => {
        console.log(data)

        let output = `
            <div>
                <div><img src=${IMGPATH + element.backdrop_path} alt="img" /></div>
                <div class="movie-info">
                    <h1>${element.original_title}</h1>
                    <h2>${element.release_date}</h2>
                    <p>${element.overview}</p>
                </div>
            </div>
        `;

        search.innerHTML += output

       
        // const el = document.createElement('div');
        // const image = document.createElement('img');
        // const text = document.createElement('h2');

        // text.innerHTML = `${element.title}`;
        // image.src = IMGPATH + element.poster_path;
        // el.appendChild(image);
        // el.appendChild(text);
        // main.appendChild(el);
    }); 
});
}

movieBtn.addEventListener('click', () => showMovies(apiUrl))

// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     main.innerHTML = '';
     
//     const searchTerm = search.value;
//     if (searchTerm) {
//         showMovies(SEARCHAPI + searchTerm);
//         search.value = "";
//     }
// });