import React from "react";
import NavBar from "../NavBar";
import PopularMovies from "./PopularMovies";
import Search from "../search/Search";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPopularMovies } from "../../features/moviesTMDB/moviesSlice";

function Home() {
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-300 to-blue-400 ">
      <NavBar />
      <div className="flex flex-col items-center">
        <div
          className=" w-11/12  rounded-lg flex flex-col items-center text-black text-md font-bold
        "
        >
          <form
            onSubmit={submitHandler}
            className="flex justify-center w-1/2 my-4"
          >
            <input
              type="text"
              className="w-full h-10 rounded-lg border-2 border-black pl-2
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
              text-black text-md font-bold
              "
              placeholder="Search for a movie..."
            />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>

          <PopularMovies />

          {/* <div className="flex flex-wrap justify-center">
            {popularMovies.map((movie) => (
              <div className="w-1/4">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
