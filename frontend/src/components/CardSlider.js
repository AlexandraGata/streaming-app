import React, { useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "./Card";

export default React.memo(function CardSlider({ data, title }) {
  const listRef = useRef();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handleDirection = (direction) => {
    const slider = listRef.current;
    const cardWidth = slider.firstChild.offsetWidth;
    const cardCount = data.length;
    const maxScrollPosition = cardWidth * cardCount;

    const currentOffset = sliderPosition * cardWidth;

    if (direction === "left" && currentOffset > 0) {
      const newOffset = Math.max(currentOffset - 5 * cardWidth, 0);
      slider.style.transform = `translateX(${-newOffset}px)`;
      setSliderPosition(newOffset / cardWidth);
    }

    if (direction === "right" && currentOffset < maxScrollPosition) {
      const newOffset = Math.min(
        currentOffset + 5 * cardWidth,
        maxScrollPosition
      );
      slider.style.transform = `translateX(${-newOffset}px)`;
      setSliderPosition(newOffset / cardWidth);
    }
  };

  return (
    <Container
      className="flex column"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1>{title}</h1>
      <div className="wrapper">
        <div
          className="slider-action left flex j-center a-center"
          style={{ display: showControls ? "flex" : "none" }}
          onClick={() => handleDirection("left")}
        >
          <AiOutlineLeft />
        </div>
        <div className="slider" ref={listRef}>
          {data.map((movie, index) => (
            <Card movieData={movie} index={index} key={movie.id} />
          ))}
        </div>
        <div
          className="slider-action right flex j-center a-center"
          style={{ display: showControls ? "flex" : "none" }}
          onClick={() => handleDirection("right")}
        >
          <AiOutlineRight />
        </div>
      </div>
    </Container>
  );
});

const Container = styled.div`
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
  padding: 0 100px;
  margin: 0 -100px;
  h1 {
    padding-left: 50px;
  }

  .wrapper {
    position: relative;

    .slider-action {
      position: absolute;
      z-index: 99;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 50px;
      transition: 0.3s ease-in-out;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      svg {
        font-size: 2rem;
      }
    }

    .left {
      left: 0;
    }

    .right {
      right: 0;
    }

    .slider {
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
      padding-left: 50px;
      padding-right: 50px;
      margin: 0 auto;

      & > div {
        flex: 0 0 auto;
        min-width: 180px;
        max-width: 250px;
      }
    }
  }
`;
