import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import { useMyListContext } from '../hooks/useMyListContext';
import { fetchMovieDetails } from '../store';

const MyListContainer = styled.div`
  padding: 2rem; /* Increased padding */
  margin: 0 auto;
  max-width: var(--max-width); /* You can set a CSS variable for max-width or replace with a static value */
`;

const Title = styled.h1`
  text-align: center;
  margin: 4rem auto 2rem; /* Increased top margin */
`;

const MovieList = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* Set to 6 columns */
  grid-gap: 2rem; /* Increased gap */
  justify-content: center;
  margin-bottom: 2rem; /* Space at the bottom */
`;


const MyListPage = () => {
  const dispatch = useDispatch();
  const movieDetailsById = useSelector(state => state.playcinema.movieDetails);
  const { myList } = useMyListContext();

  useEffect(() => {
    myList.forEach(movieId => {
      dispatch(fetchMovieDetails(movieId));
    });
  }, [dispatch, fetchMovieDetails, myList]);

  return (
    <>
      <Navbar />
      <MyListContainer>
        <Title>My Movie List</Title>
        <MovieList>
          {myList.map(movieId => {
            const movieDetails = movieDetailsById[movieId];
            return movieDetails && movieDetails.id && (
              <Card movieData={movieDetails} key={movieDetails.id} />
            );
          })}
        </MovieList>
      </MyListContainer>
    </>
  );
};

export default MyListPage;
