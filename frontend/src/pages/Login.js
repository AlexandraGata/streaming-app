import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/b2.jpg";
import logo from "../assets/logo_color.png";
import styled from "styled-components";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, error } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <StyledBackground className="flex justify-content-center align-items-center vh-100">
      <Overlay>
        <ContentWrapper className="p-3 rounded w-25">
          <div className="brand flex a-center j-center">
            <img src={logo} alt="logo" />
          </div>
          <h2>Log in</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="form-control rounded-0"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="form-control rounded-0"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-success w-100 rounded-3"
            >
              Log In
            </button>
            {error && <div className="error">{error}</div>}

            <p>Don't have an account?</p>
            <Link
              to="/register"
              className="btn-register btn btn-light w-100 rounded-3 text-decoration-none"
            >
              Register
            </Link>
          </form>
        </ContentWrapper>
      </Overlay>
    </StyledBackground>
  );
};

const StyledBackground = styled.div`
  position: relative;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  height: 100vh;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: center;
  margin-top: 120px;
  width: 400px;
  background-color: rgba(65, 19, 130, 0.7);
  padding: 20px;
  border-radius: 10px;
  text-align: center;

  .brand img {
    margin-top: 20px;
    height: 2rem;
    padding: 0rem 2rem;
  }

  .input-group {
    margin-bottom: 15px;
  }

  label {
    margin-bottom: 10px;
    text-align: left;
  }

  input {
    color: #fcfcfc;
    background-color: #0e0e0e;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 20px;
    width: 100%;
    &::placeholder {
      color: #484848;
    }
  }

  button {
    background-color: #411382;
    color: #fcfcfc;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 30px;
    cursor: pointer;
    &:hover {
      background-color: #fcfcfc;
      color: #411382;
    }
  }

  .btn-register {
    background-color: #fcfcfc;
    color: #411382;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 20px;

    cursor: pointer;
    &:hover {
      background-color: #411382;
      color: #fcfcfc;
    }
  }
`;

export default Login;
