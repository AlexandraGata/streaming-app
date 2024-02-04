import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGenres, getMoviesByGenre, fetchMovieDetails } from "../store";
import Slider from "../components/Slider";
import { useMyListContext } from "../hooks/useMyListContext";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [randomMovie, setRandomMovie] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.playcinema.genres);
  const moviesByGenre = useSelector((state) => state.playcinema.moviesByGenre);

  const { myList } = useMyListContext();

  useEffect(() => {
    myList.forEach((movieId) => {
      dispatch(fetchMovieDetails(movieId));
    });
  }, [dispatch, fetchMovieDetails, myList]);



  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genres.length > 0) {
      const randomGenreIndex = Math.floor(Math.random() * genres.length);
      const randomGenre = genres[randomGenreIndex];

      dispatch(getMoviesByGenre(randomGenre.name))
        .then((action) => {
          const genreMovies = action.payload[randomGenre.name];

          if (genreMovies && genreMovies.length > 0) {
            const randomMovieIndex = Math.floor(
              Math.random() * Math.min(20, genreMovies.length)
            );
            const movie = genreMovies[randomMovieIndex];

            if (movie && movie.image) {
              setRandomMovie(movie);
            } 
          }
        })
        .catch((error) => {
          console.error("Error fetching movies for the genre:", error);
        });
    }
  }, [genres, dispatch]);

  

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const playMovie = () => {
    if (randomMovie && randomMovie.id) {
      navigate("/player", { state: { movieId: randomMovie.id } });
    } else {
      console.error("No movie id found, cannot navigate to player.");
    }
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      {randomMovie && (
        <HeroSection
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${randomMovie.image})`,
          }}
        >
          <div className="content">
            <h1 className="title">{randomMovie.name}</h1>
            <div className="buttons">
              <button onClick={playMovie}>
                <FaPlay /> Play
              </button>
            </div>
          </div>
        </HeroSection>
      )}

      {Object.entries(moviesByGenre).map(([genreName, movies]) => (
        <Slider key={genreName} title={genreName} movies={movies} />
      ))}
    </Container>
  );
}



const HeroSection = styled.div`
  position: relative;
  height: 30em;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  

  .content {
    position: relative;
    z-index: 2;
    text-align: center;

    .title {
      font-size: 3rem;
      color: white;
      margin-bottom: 1rem;
    }

    .buttons {
      display: flex;
      justify-content: center;
      gap: 2rem;

      button {
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.2rem;
        padding: 0.5rem 2rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        background-color: rgba(141,113,180, 0.9);
        color: white;

        &:hover {
          opacity: 0.8;
        }

        svg {
          margin-right: 0.5rem;
        }
      }
    }
  }
`;

const Container = styled.div`
  background-color: #1d1d1d;
  overflow-y: hidden;
`;
