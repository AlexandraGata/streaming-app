import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useMyListContext } from "../hooks/useMyListContext";

export default React.memo(function Card({ movieData }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const hoverRef = useRef(null);
  const { addItem, removeItem, myList } = useMyListContext();

  const isInMyList = myList.includes(`${movieData.id}`);

  const toggleMyList = () => {
    if (isInMyList) {
      removeItem(movieData.id);
    } else {
      addItem(movieData.id);
    }
  };

  const handleMouseEnter = () => {
    hoverRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverRef.current);
    setIsHovered(false);
  };

  const handleWatchClick = () => {
    navigate("/player", { state: { movieId: movieData.id } });
  };

  return (
    <CardContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Thumbnail>
        <img
          src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
          alt={movieData.name}
        />
        {isHovered && (
          <>
            <Overlay />
            <TextContainer>
              <Title>{movieData.name}</Title>
              <Overview>{movieData.overview}</Overview>
              <ButtonContainer>
                <WatchButton onClick={handleWatchClick}>Watch</WatchButton>
                <AddToListButton onClick={toggleMyList}>
                  {isInMyList ? "Delete from List" : "+ My List"}
                </AddToListButton>
              </ButtonContainer>
            </TextContainer>
          </>
        )}
      </Thumbnail>
    </CardContainer>
  );
});

const cardHoverStyles = css`
  width: 250px;
  height: 340px;
  margin: 20px;
  transform: scale(1.1);

  img {
    transform: scale(1.1);
  }
`;

const CardContainer = styled.div`
  position: relative;
  width: 180px;
  height: 255px;
  cursor: pointer;
  overflow: hidden;
  margin: 10px;
  transition: all 0.3s ease-in-out;
  z-index: 1;

  &:hover {
    ${cardHoverStyles}
    z-index: 10;
  }
`;

const Thumbnail = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TextContainer = styled.div`
  width: 90%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
`;

const Title = styled.h2`
  width: 100%;
  padding: 8px 10px;
  color: white;
  font-size: 1.5em;
  text-align: left;
  margin: 0;
  box-sizing: border-box;
  z-index: 2;
`;

const Overview = styled.p`
  width: 100%;
  padding: 8px 10px;
  color: white;
  font-size: 0.7em;
  text-align: left;
  margin: 0;
  box-sizing: border-box;
  overflow-y: auto;
  flex-grow: 1;
  z-index: 2;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WatchButton = styled.button`
  background-color: #7e65a2;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const AddToListButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 5px;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;
