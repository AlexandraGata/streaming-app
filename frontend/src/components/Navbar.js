import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo_color.png";
import { FaPowerOff, FaSearch, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar({ isScrolled }) {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate("/account");
  };

  const links = [
    { name: "Home", link: "/" },
    { name: "My List", link: "/mylist" },
  ];

  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  const { user } = useAuthContext();

  return (
    <Container>
      <nav className={`flex ${isScrolled ? "scrolled" : ""}`}>
        <div className="left flex a-center">
          <div className="brand flex a-center j-center">
            <img src={logo} alt="logo" />
          </div>
          <ul className="links flex">
            {links.map((item, index) => {
              return (
                <li className="flex" key={index}>
                  <StyledLink to={item.link}>{item.name}</StyledLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="right flex a-center">
          {user && (
            <button className="account" onClick={handleAccountClick}>
              <FaUser />
            </button>
          )}
          {user && (
            <div>
              <span>{user.email}</span>
              <button className="logout" onClick={handleClick}>
                <FaPowerOff />
              </button>
            </div>
          )}
        </div>
      </nav>
    </Container>
  );
}

const Container = styled.div`
  .scrolled {
    background-color: #101010;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 5rem;
    width: 100%;
    z-index: 1000;
    background: linear-gradient(to bottom, #101010, transparent);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;

    .brand img {
      height: 2rem;
      padding: 0rem 2rem;
    }

    .links {
      list-style-type: none;
      display: flex;
      gap: 2rem;

      li {
        a {
          text-decoration: none;
          color: #fbfbfb;
          padding: 2rem 2rem 1rem 2rem;
          font-size: 1rem;
        }

        &:hover {
          a {
            color: #b6b6b6;
          }
        }
      }
    }

    .right {
      gap: 1rem;
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;

        &:focus {
          outline: none;
        }
        svg {
          color: #fbfbfb;
          font-size: 1.2rem;
        }
      }
      .search {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        padding-left: 0.5rem;
        button {
          background-color: transparent;
          border: none;
          &:focus {
            outline: none;
          }
          svg {
            color: #fbfbfb;
            font-size: 1.2rem;
          }
        }
        input {
          width: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          background-color: transparent;
          border: none;
          color: #fbfbfb;
          &:focus {
            outline: none;
          }
        }
      }
      .show-search {
        border: 1px solid #3d3d3d;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.6);
        input {
          width: 100%;
          opacity: 1;
          visibility: visible;
          padding: 0.3rem;
        }
      }
    }
  }
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
