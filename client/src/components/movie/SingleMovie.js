import React from "react";
import NavBar from "../NavBar";
import MoviePage from "./MoviePage";
import Comments from "./Comments";

function SingleMovie() {
  return (
    <div className="w-screen">
      <NavBar />
      <div className="w-full h-full flex flex-col justify-center items-center text-white text-2xl font-bold bg-gradient-to-br from-red-400 to-red-500">
        <MoviePage />
        <Comments />
      </div>
    </div>
  );
}

export default SingleMovie;
