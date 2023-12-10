import React from "react";
import NavBar from "../NavBar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getStats } from "../../features/moviesTMDB/statSlice";
import MovieCard from "../home/MovieCard";

function StatsPage() {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.statSlice);
  const { status, error } = stats;
  const {
    mostPopularMovie,
    leastPopularMovie,
    HighestRatedMovie,
    LowestRatedMovie,
    movieWithMostRatings,
    mostPopularGenre,
    leastPopularGenre,
  } = stats;

  useEffect(() => {
    // if (status === "idle" || status === "failed")
    dispatch(getStats());
  }, [dispatch]);

  return (
    <div>
      <NavBar />
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col text-white text-2xl font-bold bg-gradient-to-br from-yellow-300 to-yellow-400">
        <div className="w-screen">
          <div className="text-4xl font-bold text-center my-4 mx-auto p-2 rounded-lg bg-slate-500/90 w-[300px]">
            Stats Page
          </div>
        </div>
        <div className="w-screen">
          <div className="text-2xl font-bold text-center my-2 mx-auto p-2 rounded-lg bg-slate-500/90 w-[200px]">
            Movies stats
          </div>
        </div>
        <div
          className=" w-screen flex flex-col justify-center items-center text-white text-2xl font-bold bg-gradient-to-br from-slate-400/90 to-slate-500/90 gap-4 p-4
        "
        >
          <div className="flex items-center gap-4 w-full">
            <span className="w-[60%] text-center">
              Most popular movie: {mostPopularMovie?.movie.title}, popularity:{" "}
              {mostPopularMovie?.popularity}
            </span>
            {mostPopularMovie && <MovieCard movie={mostPopularMovie?.movie} />}
          </div>
          <div className="flex items-center gap-4 w-full">
            <span className="w-[60%] text-center">
              Least popular movie: {leastPopularMovie?.movie.title}, popularity:{" "}
              {leastPopularMovie?.popularity}
            </span>
            {mostPopularMovie && <MovieCard movie={leastPopularMovie?.movie} />}
          </div>
          <div className="flex items-center gap-4 w-full">
            <span className="w-[60%] text-center">
              Highest rated movie: {HighestRatedMovie?.movie.title}, average:{" "}
              {HighestRatedMovie?.average}
            </span>
            {mostPopularMovie && <MovieCard movie={HighestRatedMovie?.movie} />}
          </div>
          <div className="flex items-center gap-4 w-full">
            <span className="w-[60%] text-center">
              Lowest rated movie: {LowestRatedMovie?.movie.title}, average:{" "}
              {LowestRatedMovie?.average}
            </span>
            {mostPopularMovie && <MovieCard movie={LowestRatedMovie?.movie} />}
          </div>
          <div className="flex items-center gap-4 w-full">
            <span className="w-[60%] text-center">
              Movie with the most ratings: {movieWithMostRatings?.movie.title},
              average: {movieWithMostRatings?.howMany}
            </span>
            {mostPopularMovie && (
              <MovieCard movie={movieWithMostRatings?.movie} />
            )}
          </div>
          <div className="flex items-center gap-4 w-full">
            <span className="w-full text-center">
              Most popular genre: {mostPopularGenre?.genre.name}, movies:{" "}
              {mostPopularGenre?.howMany}
            </span>
          </div>
          <div className="flex items-center gap-4 w-full">
            <span className="w-full text-center">
              Least popular genre: {leastPopularGenre?.genre.name}, movies:{" "}
              {leastPopularGenre?.howMany}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
