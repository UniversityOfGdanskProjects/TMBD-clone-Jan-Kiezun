import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPopularMovies,
  setSelectedMovie,
  setMdStatus,
} from "../../features/moviesTMDB/moviesSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

function PopularMovies() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.moviesSlice);
  const popularMovies = movies.popularMovies;
  const [page, setPage] = useState(1);

  useEffect(() => {
    popularMovies.length === 0 && dispatch(getPopularMovies(page));
  }, [dispatch, popularMovies, page]);
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-black/10
    rounded-lg 
    "
    >
      <h1 className="text-4xl font-bold text-black my-2 drop-shadow-md">
        Popular Movies:
      </h1>
      <div className="flex flex-wrap justify-center gap-5 items-stretch">
        {popularMovies.length !== 0 &&
          popularMovies.movies.map((movie) => <MovieCard movie={movie} />)}
      </div>
      <div
        className="flex justify-center items-center mt-4 sticky bottom-0 w-[300px] p-2 rounded-t-xl
        bg-gradient-to-br
        from-gray-800
        to-gray-900 gap-4 select-none
      "
      >
        <button
          className={`bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded w-20`}
          onClick={() => {
            page !== 1 && dispatch(getPopularMovies(page - 1));
            page !== 1 && setPage(page - 1);
          }}
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="text-xl font-bold bg-white rounded-xl p-1">
          Page:{page}
        </div>
        <button
          className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded w-20"
          onClick={() => {
            dispatch(getPopularMovies(page + 1));
            setPage(page + 1);
          }}
          disabled={page === popularMovies.maxPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PopularMovies;
