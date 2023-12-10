import React, { useState } from "react";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import NavBar from "../NavBar";

import { useSelector, useDispatch } from "react-redux";

function Search() {
  const dispatch = useDispatch();
  const { searchedMovies } = useSelector((state) => state.searchSlice);
  const movies = searchedMovies?.movies;
  const { smStatus } = useSelector((state) => state.searchSlice);
  const [infoHovered, setInfoHovered] = useState(false);
  return (
    <div>
      <NavBar />
      <div className="w-full h-full min-h-[calc(100vh-4rem)] flex text-white text-2xl font-bold bg-gradient-to-br from-green-400 to-green-500">
        <SearchForm />
        {movies?.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-2xl font-bold">No movies found!</div>
          </div>
        ) : smStatus === "idle" ? (
          <div className="flex justify-center items-center w-full min-h-[calc(100vh-100px)]">
            <div
              className={`text-2xl font-bold select-none ${
                infoHovered ? "animate-spin" : ""
              }`}
              onMouseOver={() => setInfoHovered(true)}
              onMouseOut={() => setInfoHovered(false)}
            >
              Start searching for a movie!
            </div>
          </div>
        ) : (
          <SearchResults movies={movies} />
        )}
      </div>
    </div>
  );
}

export default Search;
