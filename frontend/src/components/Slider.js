import React from "react";
import styled from "styled-components";
import CardSlider from "./CardSlider";

export default function Slider({ title, movies }) {
  return (
    <Container>
      <CardSlider data={movies} title={title} />
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 20px;
  overflow: hidden;
`;
