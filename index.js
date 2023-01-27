const v4readAccessToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzhhOTM4MTU2MDc4MGQ3ZWU2Y2Q5YzBmNzVmYmMxOSIsInN1YiI6IjVjOWEwYTlmYzNhMzY4MDcwMjNjMjA5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZsOvnOHW07QoNbh5_PwUZMQDUrMTjpWlDqSQ7LVgW3M';

const tmdbBaseUrl = 'https://api.themoviedb.org/3';

// axios client instance for TMDB API
const tmdbAxios = axios.create({
  baseURL: tmdbBaseUrl,
  headers: {
    Authorization: `Bearer ${v4readAccessToken}`,
    'Content-Type': 'application/json',
  },
});

// get movies by query
const getMoviesByQuery = async (query) => {
  try {
    const response = await tmdbAxios.get(`/search/movie?query=${query}`);
    return response.data.results;
  } catch (error) {
    console.log(error);
  }
};

// get movie by id
const getMovieById = async (id) => {
  try {
    const response = await tmdbAxios.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createMovieInputValue = (movie) => {
  return movie.title;
};

const createImgSrc = (movie) => {
  const imgSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450';

  return imgSrc;
};

const createGenresString = (genres) => {
  const genresString = genres
    .map(({ name }) => name)
    .join(', ')
    .trim();

  return genresString + '.';
};

const createMovieSummaryComponent = (movieData) => {
  const imgSrc = createImgSrc(movieData);
  const genres = createGenresString(movieData.genres);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${imgSrc}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieData.title}</h1>
          <h4>${genres}</h4>
          <p>${movieData.overview}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieData.vote_average}</p>
      <p>Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieData.vote_count}</p>
      <p>Votes</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieData.revenue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })}</p>
      <p>revenue</p>
    </article>
  `;
};

const onMovieSelect = async (movie, summaryElement) => {
  try {
    document.querySelector('.tutorial').classList.add('is-hidden');
    const movieData = await getMovieById(movie.id);
    const movieComponent = createMovieSummaryComponent(movieData);
    summaryElement.innerHTML = movieComponent;
  } catch (error) {
    console.log(error);
  }
};

const renderMovieOption = (movie) => {
  const imgSrc = createImgSrc(movie);
  return `
      <img src="${imgSrc}" alt="${movie.title}">
      ${movie.title} (${getYear(movie.release_date)})
    `;
};

const autocompleteConfig = {
  getOptions: getMoviesByQuery,
  renderOption: renderMovieOption,
  createInputValue: createMovieInputValue,
};

// DOM interacion: Autocomplete element
createAutocompleteComponent({
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect: (movie) =>
    onMovieSelect(movie, document.querySelector('#left-summary')),
  ...autocompleteConfig,
});

createAutocompleteComponent({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) =>
    onMovieSelect(movie, document.querySelector('#right-summary')),
  ...autocompleteConfig,
});
