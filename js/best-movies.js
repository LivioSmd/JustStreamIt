const bestMovieUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';
const bestMovieNextPageUrl = 'http://localhost:8000/api/v1/titles/?page=2&sort_by=-imdb_score' //utiliser le next

async function movieRequest(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur response !');
  }
  const data = await response.json();
  return data;
}

movieRequest(bestMovieUrl)
  .then(data => {
    const dataMovies = data.results;
    console.log("data-movies: ", dataMovies);

    let i = 0;
    for (const movie of dataMovies) {
      fetchInMovie(movie, i);
      i++;
    }

    if (i != 7) {
      console.log("MANQUE")
    }
    

  })
  .catch(error => {
    console.log('Erreur :', error);
  });

async function fetchInMovie(movie, i) {
    console.log("movie-url: ", movie.url);
    console.log("i: ",i);

    movieRequest(movie.url)
      .then(data =>{
        if (i === 0) {
          const image = data.image_url;
          const title = data.title;
          const description = data.description;
    
          console.log('image: ', image);
          console.log('title: ', title);
          console.log('description: ', description);
    
          const bestMovieImage = document.getElementById('best-movie-img');
          const bestMovieTitle = document.getElementById('best-movie-title');
          const bestMovieDescription = document.getElementById('best-movie-description');
    
          bestMovieImage.src = image;
          bestMovieTitle.textContent = title;
          bestMovieDescription.textContent = description;
        } else {
          const image = data.image_url;
          const title = data.title;
    
          console.log('image: ', image);
          console.log('title: ', title);
    
          const bestMovieImage = document.getElementById('best-movie-img-' + i);
          const bestMovieTitle = document.getElementById('best-movie-title-' + i);
    
          bestMovieImage.src = image;
          bestMovieTitle.textContent = title;
        }
      })
      .catch(error => {
        console.log('Erreur :', error);
      })
}

/*
moviesRequest(bestMovieNextPageUrl)
  .then(data => {
    const dataBestsMoviesNextPage = data.results;
    console.log("data: ", dataBestsMoviesNextPage);

    fetchBestMovieNextPage(dataBestsMoviesNextPage)
  })
  .catch(error => {
    console.log('Erreur :', error);
  });

  async function fetchBestMovieNextPage(movieNextPage) {
    try {
      console.log("url: ", movieNextPage[0].url);
  
      const response1 = await fetch(movieNextPage[0].url);
      if (!response1.ok) {
        throw new Error('Erreur response !');
      }
      const data = await response1.json();
      
      const image = data.image_url;
      const title = data.title;
  
      console.log('image: ', image);
      console.log('title: ', title);
  
      const bestMovieImage = document.getElementById('best-movie-img-5');
      const bestMovieTitle = document.getElementById('best-movie-title-5');
  
      bestMovieImage.src = image;
      bestMovieTitle.textContent = title;

      const response2 = await fetch(movieNextPage[1].url);
      if (!response2.ok) {
        throw new Error('Erreur response !');
      }
      const data2 = await response2.json();
      
      const image2 = data2.image_url;
      const title2 = data2.title;
  
      console.log('image: ', image);
      console.log('title: ', title);
  
      const bestMovieImage2 = document.getElementById('best-movie-img-6');
      const bestMovieTitle2 = document.getElementById('best-movie-title-6');
  
      bestMovieImage2.src = image2;
      bestMovieTitle2.textContent = title2;
  
    } catch (error) {
      console.log('Erreur :', error);
    }
  }
  */
