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
        const bestMovieImage = document.getElementById('movie-img-' + j);
        const bestMovieTitle = document.getElementById('movie-title-' + j);
        bestMovieImage.src = '';
        bestMovieTitle.textContent = '';

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
        /*
        if (i === 0) {
            const image = data.image_url;
            const title = data.title;
            const description = data.description;
    
            const bestMovieImage = document.getElementById('best-movie-img');
            const bestMovieTitle = document.getElementById('best-movie-title');
            const bestMovieDescription = document.getElementById('best-movie-description');
    
            bestMovieImage.src = image;
            bestMovieTitle.textContent = title;
            bestMovieDescription.textContent = description;
        } else {
            const image = data.image_url;
            const title = data.title;
    
            const bestMovieImage = document.getElementById('best-movie-img-' + i);
            const bestMovieTitle = document.getElementById('best-movie-title-' + i);
    
            bestMovieImage.src = image;
            bestMovieTitle.textContent = title;
        }
        */
        const image = data.image_url;
        const title = data.title;

        console.log("image:", image)
        console.log("title:", title)

        const bestMovieImage = document.getElementById('movie-img-' + i);
        const bestMovieTitle = document.getElementById('movie-title-' + i);
        const cardInfo = document.getElementById('card-info-' + i); 

        bestMovieImage.src = image;
        bestMovieTitle.textContent = title;
        cardInfo.style.display = 'flex' // retarblir le display flex pour les cards qui ont été display none
    } catch (error) {
        console.log('Erreur :', error);
    }
}

// DropDown Method
function setDropdown() {
    document.addEventListener("DOMContentLoaded", () => { // DOMContentLoaded :  écouteur d'événements  qui se déclenche lorsque le HTML initial de la page a été complètement chargé et analysé
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
        const bestMovieData = await movieRequest(bestMovieUrl); //1 
        await mainMovieResquest(bestMovieData);

        const biographyMovieData = await movieRequest(biographyMovieUrl); //2
        await mainMovieResquest(biographyMovieData);

        const actionMovieData = await movieRequest(actionMovieUrl); //3
        await mainMovieResquest(actionMovieData);

        const dropdownfirstDisplayData = await movieRequest(setDropdownDefaultValue()); //4
        await mainMovieResquest(dropdownfirstDisplayData);
    } catch (error) {
        console.log('Erreur :', error);
    }
}

resquest();
setDropdown();

