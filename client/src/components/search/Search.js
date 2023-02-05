import React from "react";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchedMovies";
import NavBar from "../NavBar";

function Search() {
  return (
    <div>
      <NavBar />
      <div className="w-full h-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-white text-2xl font-bold bg-gradient-to-br from-green-400 to-green-500">
        <SearchForm />
        <SearchResults />
      </div>
    </div>
  );
}

export default Search;
