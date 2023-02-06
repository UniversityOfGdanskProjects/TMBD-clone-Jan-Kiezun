import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPopularMovies } from "./features/moviesTMDB/moviesSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import Home from "./components/home/Home";
import LoginPanel from "./components/login/LoginPanel";
import RegisterPanel from "./components/login/RegisterPanel";
import SingleMovie from "./components/movie/SingleMovie";
import Search from "./components/search/Search";

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersSlice);
  const loginStatus = users.loginStatus;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPanel />} />
        <Route path="/register" element={<RegisterPanel />} />
        <Route
          path="/home"
          element={
            loginStatus === "logged in" ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/movie/:id"
          element={
            loginStatus === "logged in" ? (
              <SingleMovie />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/search"
          element={
            loginStatus === "logged in" ? <Search /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={
            loginStatus === "logged in" ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
