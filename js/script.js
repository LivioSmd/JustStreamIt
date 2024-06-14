const bestMovieUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';
const biographyMovieUrl = 'http://localhost:8000/api/v1/titles/?genre=biography&sort_by=-imdb_score';
const actionMovieUrl = 'http://localhost:8000/api/v1/titles/?genre=action&sort_by=-imdb_score';


let i = 1;


async function movieRequest(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur response !');
  }
  const data = await response.json();
  return data;
}

function movieLoop (dataMovies) {
  try {
    for (const movie of dataMovies) {
      fetchInMovie(movie, i);
      i++;
  
      if (i == 7 || i == 13 || i == 19 || i == 25) {
        break
      }  
    }
  } catch (error) {
    console.log('Erreur :', error);
  }
}

async function mainMovieResquest (data) {
  const dataMovies = data.results;
  console.log("data-movies: ", dataMovies);

  movieLoop(dataMovies)
  
  try {
    const nextPageData = await movieRequest(data.next);
    const dataMoviesNextPage = nextPageData.results;
    console.log("data-movies-next-page: ", dataMoviesNextPage);
    
    movieLoop(dataMoviesNextPage);
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

      bestMovieImage.src = image;
      bestMovieTitle.textContent = title;
    } catch (error) {
      console.log('Erreur :', error);
    }
}

async function main() {
  try {
    const bestMovieData = await movieRequest(bestMovieUrl); //1 
    await mainMovieResquest(bestMovieData);

    const biographyMovieData = await movieRequest(biographyMovieUrl); //2
    await mainMovieResquest(biographyMovieData);

    const actionMovieData = await movieRequest(actionMovieUrl);//3
    await mainMovieResquest(actionMovieData);
  } catch (error) {
    console.log('Erreur :', error);
  }
}

main();



  