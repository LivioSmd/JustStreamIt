const bestMovieUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';
const biographyMovieUrl = 'http://localhost:8000/api/v1/titles/?genre=biography&sort_by=-imdb_score';
const crimeMovieUrl = 'http://localhost:8000/api/v1/titles/?genre=crime&sort_by=-imdb_score';
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
        document.getElementById('movie-img-' + j).src = '';
        document.getElementById('movie-title-' + j).textContent = '';

        if(lenght < 5) {
            const cardInfo = document.getElementById('card-info-' + j); // pour afficher ou non les cards quand la categorie ne contient pas assez de films
            cardInfo.style.display = 'none'
        }
    }
}

async function movieLoop(dataMovies, length) {
    const target = i + length; // pour les categorie ne comptenant pas plus de 5 films
    let first = true 
    try {
        for (const movie of dataMovies) {

            if (i === 1 && first) { // recup 7 films pour la premiere categorie
                first = !first
                i = 0; // réinitialisation de i à 0
                await fetchInMovie(movie, i);
                i = 1; // mise à jour de i à 2 après traitement
            } else {
                await fetchInMovie(movie, i);
                i++;
    
                if ((i - 1) % 6 === 0) { // stop la boucle si 5 films
                    console.log('Reset i due to multiple of 6');
                    break;
                } else if (i === target) { // stop la boucle si catégorie pas complete (moins de 5 films)
                    console.log('Reset source due to reaching target');
                    resetSource(target, length);
                    break;
                }
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

    try {
        const data = await movieRequest(movie.url);
        if (i === 0) {
            document.getElementById('best-movie-img').src = data.image_url;
            document.getElementById('best-movie-title').textContent = data.title;
            document.getElementById('best-movie-description').textContent = data.description;
            document.getElementById('btn-best-movie').setAttribute('data-id', data.id);
        } else {
            document.getElementById('movie-img-' + i).src = data.image_url;
            document.getElementById('movie-title-' + i).textContent = data.title;
            document.getElementById('btn-card-' + i).setAttribute('data-id', data.id);
            if(i >= 19) {
                const cardInfo = document.getElementById('card-info-' + i); 
                cardInfo.style.display = 'flex' // retarblir le display flex pour les cards qui ont été display none. Seulement pour le section ou le genre est selectionnable
            }
        }
    } catch (error) {
        console.log('Erreur :', error);
    }
}

// DropDown Method
function setDropdown() {
    document.addEventListener("DOMContentLoaded", async () => { // DOMContentLoaded :  écouteur d'événements qui se déclenche lorsque le HTML initial de la page a été complètement chargé et analysé
        setDropdownDefaultValue()
        await getCategories()

        let dropdownOptions = document.querySelectorAll('.dropdown-li');
        console.log('dropdownOptions:' ,dropdownOptions)
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
    const dropdownDefault = 'Family'
    dropdown.innerText = dropdownDefault;
    const defaultUrl = url(dropdownDefault)
    return defaultUrl
}

async function getCategories() {
    let data = await movieRequest('http://localhost:8000/api/v1/genres/');
    const categoriesList = []; 

    data.results.forEach((item) => categoriesList.push(item.name));

    try {
        while (data.next) {
            data = await movieRequest(data.next);
            data.results.forEach((item) => categoriesList.push(item.name));
        }
        console.log('categoriesList: ', categoriesList);
        console.log('No more pages to fetch.');
    } catch (error) {
        console.log('Erreur: ', error)
    }
    
        const ul = document.getElementById('dropdown-ul')
        for (categorie of categoriesList) {
            console.log('categorie:' ,categorie)
            const li = document.createElement('li')
            li.classList.add('dropdown-li')

            const a = document.createElement('a');
            a.textContent = categorie
            a.href = ('#dropdown')
            a.classList.add('dropdown-item')
            a.classList.add('p-2')

            li.appendChild(a)
            ul.appendChild(li)        
        } 
}

async function resquest() {
    try {
        const bestMovieData = await movieRequest(bestMovieUrl);
        await mainMovieResquest(bestMovieData);

        const biographyMovieData = await movieRequest(biographyMovieUrl);
        await mainMovieResquest(biographyMovieData);

        const actionMovieData = await movieRequest(crimeMovieUrl);
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
    const dataModal = await movieRequest(`http://localhost:8000/api/v1/titles/${id}`);
    console.log(dataModal)

    document.getElementById('modal-img').src = dataModal.image_url;
    document.getElementById('modal-title').textContent = dataModal.title
    document.getElementById('modal-year-genres').textContent = `${dataModal.year} - ${dataModal.genres}`;
    document.getElementById('modal-imdb').textContent = `IMDB Score: ${dataModal.imdb_score}/10`;
    document.getElementById('modal-directors').textContent = dataModal.directors;
    document.getElementById('modal-description').textContent = dataModal.long_description;
    document.getElementById('modal-actors').textContent = dataModal.actors;
    
    if (dataModal.rated === "Not rated or unkown rating") { // Verif si on a un PG, sinon on met 0
        document.getElementById('modal-pg-time-contries').textContent = `PG-${0} - ${dataModal.duration} minutes (${dataModal.countries})`;
    } else {
        document.getElementById('modal-pg-time-contries').textContent = `PG-${data.rated} - ${dataModal.duration} minutes (${dataModal.countries})`;
    }
})))

/* Bouton Voir plus et Voir moins */
let voirPlusButton = document.querySelectorAll('.voir-plus-button');
let voirMoinsButton = document.querySelectorAll('.voir-moins-button');

voirPlusButton.forEach((btn) => (btn.addEventListener("click", async() => {
    btn.classList.add('d-none');

    category = btn.dataset.plus
    let cardVoirPlus = document.querySelectorAll(`.voir-plus-card-${category}`);
    cardVoirPlus.forEach((card) => {
        card.classList.remove('d-none');
    });

    let thisVoirMoinsButton = document.querySelector(`[data-moins="${category}"]`)
    thisVoirMoinsButton.classList.remove('d-none');
})))


voirMoinsButton.forEach((btn) => (btn.addEventListener("click", async() => {
    btn.classList.add('d-none');

    category = btn.dataset.moins
    let cardVoirPlus = document.querySelectorAll(`.voir-plus-card-${category}`);
    cardVoirPlus.forEach((card) => {
        card.classList.add('d-none');
    });

    let thisVoirPlusButton = document.querySelector(`[data-plus="${category}"]`)
    thisVoirPlusButton.classList.remove('d-none');
})));

resquest();
setDropdown();