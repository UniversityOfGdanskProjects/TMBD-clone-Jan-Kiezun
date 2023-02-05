import React, { useEffect } from "react";
import Ratings from "./Ratings";
import { useDispatch, useSelector } from "react-redux";
import { getMovieDetails } from "../../features/moviesTMDB/moviesSlice";
import { useParams } from "react-router-dom";

function MoviePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const movies = useSelector((state) => state.moviesSlice);
  const selectedMovie = movies.selectedMovie.movie;
  const mdStatus = movies.mdStatus;

  useEffect(() => {
    if (mdStatus === "idle") dispatch(getMovieDetails(id));
  }, [dispatch, mdStatus, id]);
  console.log(selectedMovie);
  return (
    <div className="w-full">
      {mdStatus === "loading" ? (
        <div>Loading...</div>
      ) : (
        mdStatus === "succeeded" && (
          <div
            className="w-full min-h-[calc(100vh-4rem)] border-b-2 border-black overflow-hidden
          "
          >
            <div className="flex">
              <div className="flex justify-center items-center w-[500px] h-[calc(100vh-4rem)]">
                <img
                  className="w-[400px] object-cover"
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src =
                      "https://via.placeholder.com/500/333333/FFFFFF/?text=PosterNotFound :(";
                  }}
                  alt={selectedMovie.title}
                />
              </div>
              <div className="text-2xl font-bold">{selectedMovie.title}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default MoviePage;
