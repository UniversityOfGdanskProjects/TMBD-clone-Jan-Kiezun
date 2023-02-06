import React, { useState } from "react";
import MovieCard from "../home/MovieCard";
import { getSearchedMovies } from "../../features/moviesTMDB/searchSlice";

import { useSelector, useDispatch } from "react-redux";

function SearchResults({ movies, getMovies }) {
  const smStatus = useSelector((state) => state.searchSlice.smStatus);
  const searchValues = useSelector((state) => state.searchSlice.searchValues);
  const { searchTerm, genres, sort, order } = searchValues;
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  return (
    <div className="w-full">
      <div
        className="
      w-full mt-4 h-full min-h-[calc(100vh-4rem)] flex flex-wrap gap-4 items-stretch
      "
      >
        {smStatus === "succeeded" &&
          movies?.map((movie) => {
            return <MovieCard key={movie.id} movie={movie} />;
          })}
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
            page !== 1 &&
              dispatch(
                getSearchedMovies({
                  searchTerm,
                  genres,
                  sort,
                  order,
                  page: page - 1,
                })
              );
            page !== 1 && setPage(page - 1);
          }}
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="text-xl font-bold bg-white text-black rounded-xl p-1">
          Page:{page}
        </div>
        <button
          className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded w-20"
          onClick={() => {
            dispatch(
              getSearchedMovies({
                searchTerm,
                genres,
                sort,
                order,
                page: page + 1,
              })
            );
            setPage(page + 1);
          }}
          disabled={page === movies?.maxPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchResults;
