import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext"; 
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Player from "./pages/Player";
import Account from "./pages/Account";
import MyList from "./pages/MyList";
import "./App.css";
import { MyListProvider } from "./context/MyListContext"; 

function App() {
  const { user } = useAuthContext(); 

  return (
    <MyListProvider>
      <Router>
        <Routes>
          <Route
            path="/register"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/player"
            element={user ? <Player /> : <Navigate to="/login" />}
          />
          <Route
            path="/account"
            element={user ? <Account /> : <Navigate to="/login" />}
          />
          <Route
            path="/mylist"
            element={user ? <MyList /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </MyListProvider>
  );
}

export default App;
