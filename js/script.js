const bestMovieUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';

async function bestMovieRequest(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur response !');
  }
  const data = await response.json();
  return data;
}

bestMovieRequest(bestMovieUrl)
  .then(data => {
    const dataBestsMovies = data.results;
    console.log(dataBestsMovies);

    let i = 0;
    for (const movie of dataBestsMovies) {
      fetchBestMovie(movie, i);
      i++;
    }
  })
  .catch(error => {
    console.error('Erreur :', error);
  });

async function fetchBestMovie(movie, i) {
  try {
    console.log(movie.url);
    console.log(i);

    const response = await fetch(movie.url);
    if (!response.ok) {
      throw new Error('Erreur response !');
    }
    const data = await response.json();

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
    }

    if (i === 1) {
      const image = data.image_url;
      const title = data.title;

      console.log('image: ', image);
      console.log('title: ', title);

      const bestMovieImage = document.getElementById('best-movie-img-1');
      const bestMovieTitle = document.getElementById('best-movie-title-1');

      bestMovieImage.src = image;
      bestMovieTitle.textContent = title;
    }

    if (i === 2) {
      const image = data.image_url;
      const title = data.title;

      console.log('image: ', image);
      console.log('title: ', title);

      const bestMovieImage = document.getElementById('best-movie-img-2');
      const bestMovieTitle = document.getElementById('best-movie-title-2');

      bestMovieImage.src = image;
      bestMovieTitle.textContent = title;
    }

    if (i === 3) {
      const image = data.image_url;
      const title = data.title;

      console.log('image: ', image);
      console.log('title: ', title);

      const bestMovieImage = document.getElementById('best-movie-img-3');
      const bestMovieTitle = document.getElementById('best-movie-title-3');

      bestMovieImage.src = image;
      bestMovieTitle.textContent = title;
    }

    if (i === 4) {
      const image = data.image_url;
      const title = data.title;

      console.log('image: ', image);
      console.log('title: ', title);

      const bestMovieImage = document.getElementById('best-movie-img-4');
      const bestMovieTitle = document.getElementById('best-movie-title-4');

      bestMovieImage.src = image;
      bestMovieTitle.textContent = title;
    }

    console.log(data.title);
  } catch (error) {
    console.error('Erreur :', error);
  }
}
