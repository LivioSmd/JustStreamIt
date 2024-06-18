const bestMovieUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';
const biographyMovieUrl = 'http://localhost:8000/api/v1/titles/?genre=biography&sort_by=-imdb_score';
const actionMovieUrl = 'http://localhost:8000/api/v1/titles/?genre=action&sort_by=-imdb_score';
const dropdown = document.getElementById('dropdown');


let i = 1;

// Request Method
async function movieRequest(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Erreur response !');
    }
    const data = await response.json();
    return data;
}

function resetSource(target, lenght) { // enleve la source des cards qui sont vides
    for (let j = target; (j - 1) % 6!= 0; j++) {
        const movieImage = document.getElementById('movie-img-' + j);
        const movieTitle = document.getElementById('movie-title-' + j);
        movieImage.src = '';
        movieTitle.textContent = '';

        if(lenght < 5) {
            const cardInfo = document.getElementById('card-info-' + j); // pour afficher ou non les cards quand la categorie ne contient pas assez de films
            cardInfo.style.display = 'none'
        }
    }
}

function movieLoop(dataMovies, length) {
    const target = i + length; // pour les categorie ne comptenant pas plus de 5 films
    console.log("target: ", target)

    try {
        for (const movie of dataMovies) {
            fetchInMovie(movie, i);
            i++;
            console.log("for i: ", i)
  
            if ((i - 1) % 6 == 0) {
                break;
            } else if (i === target) {
                resetSource(target, length)
                break;
            }

        }
    } catch (error) {
        console.log('Erreur: ', error);
    }
}

function url(option) {
    const url = `http://localhost:8000/api/v1/titles/?genre=${option}&sort_by=-imdb_score`
    return url
}

async function mainMovieResquest (data) {
    const dataMovies = data.results;
    console.log("data-movies: ", dataMovies);
    console.log("data-movies-lenght: ", dataMovies.length);
    
    movieLoop(dataMovies, dataMovies.length)

    try {
        if (data.next) { // verifie si il y a une next page
            const nextPageData = await movieRequest(data.next);
            const dataMoviesNextPage = nextPageData.results;
            console.log("data-movies-next-page: ", dataMoviesNextPage);
        
            movieLoop(dataMoviesNextPage, dataMoviesNextPage.length);
        }
    } catch (error) {
        console.log('Erreur :', error);
    }
        
}

async function fetchInMovie(movie, i) {
    console.log("movie-title :", movie.title + "\nmovie-url: ", movie.url);
    console.log("i: ",i);

    try {
        const data = await movieRequest(movie.url);
        if (i === 1) {
            const image = data.image_url;
            const title = data.title;
            const description = data.description;
            const id = data.id;

            const bestMovieImage = document.getElementById('best-movie-img');
            const bestMovieTitle = document.getElementById('best-movie-title');
            const bestMovieDescription = document.getElementById('best-movie-description');
            const btnModal = document.getElementById('btn-best-movie');

            bestMovieImage.src = image;
            bestMovieTitle.textContent = title;
            bestMovieDescription.textContent = description;
            btnModal.setAttribute('data-id', id);
        } 
        const image = data.image_url;
        const title = data.title;
        const id = data.id;

        console.log("image:", image)
        console.log("title:", title)
        console.log("id:", id)

        const movieImage = document.getElementById('movie-img-' + i);
        const movieTitle = document.getElementById('movie-title-' + i);
        const btnModal = document.getElementById('btn-card-' + i); 

        btnModal.setAttribute('data-id', id);
        movieImage.src = image;
        movieTitle.textContent = title;

        if(i >= 19) {
            const cardInfo = document.getElementById('card-info-' + i); 
            cardInfo.style.display = 'flex' // retarblir le display flex pour les cards qui ont été display none. Seulement pour le section ou le genre est selectionnable
        }
    } catch (error) {
        console.log('Erreur :', error);
    }
}

// DropDown Method
function setDropdown() {
    document.addEventListener("DOMContentLoaded", () => { // DOMContentLoaded :  écouteur d'événements qui se déclenche lorsque le HTML initial de la page a été complètement chargé et analysé
        setDropdownDefaultValue()
        let dropdownOptions = document.querySelectorAll('.dropdown-item');
    
        dropdownOptions.forEach(function(option) {
            option.addEventListener('click', async function(e) {
                let selectedOption = this.innerText;
                dropdown.innerText = selectedOption;
                console.log("Category selected", selectedOption);
                const dropdownUrl = url(selectedOption);
                console.log('dropdownUrl', dropdownUrl);
                i = 19
                try {
                    const dropdownData = await movieRequest(dropdownUrl);
                    console.log("dropdownData:", dropdownData)
                    await mainMovieResquest(dropdownData);
                } catch (error) {
                    console.log('Erreur :', error);
                }
            });
        });
    });
}
 
function setDropdownDefaultValue() {
    const dropdownDefault = 'Animation'
    dropdown.innerText = dropdownDefault;
    const defaultUrl = url(dropdownDefault)
    console.log(defaultUrl)
    return defaultUrl
}

async function resquest() {
    try {
        const bestMovieData = await movieRequest(bestMovieUrl);
        await mainMovieResquest(bestMovieData);

        const biographyMovieData = await movieRequest(biographyMovieUrl);
        await mainMovieResquest(biographyMovieData);

        const actionMovieData = await movieRequest(actionMovieUrl);
        await mainMovieResquest(actionMovieData);

        const dropdownfirstDisplayData = await movieRequest(setDropdownDefaultValue());
        await mainMovieResquest(dropdownfirstDisplayData);
    } catch (error) {
        console.log('Erreur request : ', error);
    }
}

let buttonsModal = document.querySelectorAll('.btn-modal');
buttonsModal.forEach((btn) => (btn.addEventListener("click", async() => {
    id = btn.dataset.id
    console.log(id)
    const dataModal = await movieRequest(`http://localhost:8000/api/v1/titles/${id}`);
    console.log(dataModal)

    const image = dataModal.image_url
    const title = dataModal.title
    const year = dataModal.year
    const genres = dataModal.genres
    let pg = '0'
    const duration = dataModal.duration // in minute
    const countries = dataModal.countries
    const imdb_score = dataModal.imdb_score
    const directors = dataModal.directors
    const long_description = dataModal.long_description
    const actors = dataModal.actors

    const modalImage = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalYearGenres = document.getElementById('modal-year-genres');
    const modalPgTimeCountries = document.getElementById('modal-pg-time-contries');
    const modalImdb = document.getElementById('modal-imdb');
    const modalDirectors = document.getElementById('modal-directors');
    const modaldescription = document.getElementById('modal-description');
    const modalActors = document.getElementById('modal-actors')

    modalTitle.textContent = title;
    modalImage.src = image;
    modalYearGenres.textContent = `${year} - ${genres}`;
    modalPgTimeCountries.textContent = `PG-${pg} - ${duration} minutes (${countries})`;
    modalImdb.textContent = `IMDB Score: ${imdb_score}/10`;
    modalDirectors.textContent = directors;
    modaldescription.textContent = long_description;
    modalActors.textContent = actors;

})))

resquest();
setDropdown();

// Image du meilleur film est la meme que celle de la premiere de la catégorie meilleurs films ?
// Ligne 192 : voir avec mentor (le 0)
// Voir avec mentor, dans cahier des charges "Les recettes au box-office dans la modale" mais pas dans la maquette
// Voir avec mentor, Readme ?
// Mentor "Lorsqu’on clique sur le bouton du film en vedette ou sur l’image d’un des films, une fenêtre modale s’ouvre", ca ne parle pas du bouton détails, donc le faire ou pas ?

// Faire le responsive tablette 
// Faire le responsive tel (attention aux "Voir plus")
// Régler les Erreurs dans la console (attention aux "Voir plus")
