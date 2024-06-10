const bestMovieUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';

function bestMovieRequest(url) {
  fetch(bestMovieUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur');
    }
    return response.json();
  })
  .then(data => {
    const dataBestMovieUrl = data.results[0].url;
    console.log('best_movie_url: ', dataBestMovieUrl);

    fetch(dataBestMovieUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur');
        }
        return response.json();
      })
      .then(data => {
        const dataBestMovieImage = data.image_url;
        const dataBestMovieTitle = data.title;
        const dataBestMovieDescription = data.description;

        console.log('best_movie_image: ', dataBestMovieImage)
        console.log('best_movie_title: ', dataBestMovieTitle)
        console.log('best_movie_description: ', dataBestMovieDescription)

        const bestMovieImage = document.getElementById('best-movie-img');
        const bestMovieTitle = document.getElementById('best-movie-title');
        const bestMovieDescription = document.getElementById('best-movie-description');

        bestMovieImage.src = dataBestMovieImage;
        bestMovieTitle.textContent = dataBestMovieTitle;
        bestMovieDescription.textContent = dataBestMovieDescription;
      })
      .catch(error => {
        console.error('Erreur lors de la requête:', error);
      });
  })
  .catch(error => {
    console.error('Erreur lors de la requête:', error);
  });
}

bestMovieRequest(bestMovieUrl);

