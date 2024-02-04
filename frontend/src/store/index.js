import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_URL } from "../utils/constants";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  trailer: null,
  trailerLoading: false,
  moviesByGenre: {},
  randomMovie: null,
  randomMovieLoading: false,
  randomMovieError: null,
  movieDetails: {},
};

export const getGenres = createAsyncThunk("playcinema/genres", async () => {
  try {
    const response = await axios.get(`${TMDB_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
      },
    });

    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);

    return [];
  }
});

export const fetchTrailer = createAsyncThunk(
  "playcinema/trailer",
  async (movieId) => {
    const response = await axios.get(
      `${TMDB_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const trailer = response.data.results.find(
      (v) => v.type === "Trailer" && v.official === true
    )?.key;
    return trailer ? `${trailer}` : null;
  }
);

export const getMoviesByGenre = createAsyncThunk(
  "playcinema/moviesByGenre",
  async (_, { getState }) => {
    const { genres } = getState().playcinema;
    const moviesByGenre = {};

    for (const genre of genres) {
      let page = 1;
      let fetchedMovies = [];

      while (fetchedMovies.length < 20) {
        try {
          const response = await axios.get(`${TMDB_URL}/discover/movie`, {
            params: {
              api_key: API_KEY,
              with_genres: genre.id.toString(),
              page,
              include_adult: false,
            },
          });

          fetchedMovies.push(...response.data.results);

          if (fetchedMovies.length >= 20 || page >= response.data.total_pages) {
            break;
          }

          page++;
        } catch (error) {
          console.error(
            `Error fetching movies for genre ${genre.name}:`,
            error.response || error.message
          );
          break;
        }
      }

      moviesByGenre[genre.name] = fetchedMovies.slice(0, 20).map((movie) => ({
        id: movie.id,
        name: movie.title,
        overview: movie.overview,
        image: movie.poster_path,

        trailer: null,
      }));
    }

    return moviesByGenre;
  }
);

export const fetchMovieDetails = createAsyncThunk(
  "playcinema/fetchMovieDetails",
  async (movieId) => {
    const response = await axios.get(
      `${TMDB_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    const { id, title: name, overview, poster_path: image } = response.data;
    return {
      id,
      name,
      overview,
      image,
    };
  }
);

const playCinemaSlice = createSlice({
  name: "playcinema",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.genresLoaded = true;
      })
      .addCase(fetchTrailer.fulfilled, (state, action) => {
        state.trailer = action.payload;
        state.trailerLoading = false;
      })
      .addCase(fetchTrailer.pending, (state) => {
        state.trailerLoading = true;
      })
      .addCase(fetchTrailer.rejected, (state) => {
        state.trailerLoading = false;
      })
      .addCase(getMoviesByGenre.fulfilled, (state, action) => {
        state.moviesByGenre = action.payload;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.movieDetails[action.payload.id] = action.payload;
      });
  },
});

export const store = configureStore({
  reducer: {
    playcinema: playCinemaSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
