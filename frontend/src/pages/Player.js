import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_KEY, TMDB_URL } from "../utils/constants";
import { useAuthContext } from "../hooks/useAuthContext";
import { fetchTrailer } from "../store";
import { useDispatch } from "react-redux";

export default function Player() {
  const navigate = useNavigate();
  const location = useLocation();
  const { movieId } = location.state || {};
  const [trailerKey, setTrailerKey] = useState("");
  const [opts, setOpts] = useState({
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  });
  const { user, subscribe, checkSubscriptionStatus, unsubscribe } =
    useAuthContext();
  const dispatch = useDispatch();
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchTrailer(movieId))
        .then((action) => {
          if (action.payload) {
            setTrailerKey(action.payload);
          }
        })
        .catch((error) => {
          console.error("Error fetching trailer:", error);
        });
    }
  }, [dispatch, movieId]);

  return (
    <Container>
      {user && user.subscriptionStatus === "active" ? (
        <div className="player">
          <div className="back">
            <BsArrowLeft onClick={() => navigate(-1)} />
          </div>
          {trailerKey ? (
            <YouTube videoId={trailerKey} opts={opts} id="video" />
          ) : (
            <div>Loading trailer...</div>
          )}
        </div>
      ) : (
        <h2>
          Access to premium content is exclusive to our subscribers. <br />
          <a href="/account" className="subscribe-link">
            Subscribe now
          </a>{" "}
          to enjoy unlimited access.
        </h2>
      )}
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .player {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: black;

    .back {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;

      svg {
        font-size: 3rem;
        cursor: pointer;
        color: white;
      }
    }

    #video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 1.5rem;
    }
  }

  h2 {
    text-align: center;
    color: white;
    font-size: 2rem;
    background-color: rgba(118, 3, 153, 0.7);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }
`;
