import React, { useEffect, useState } from "react";
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

  const [ratingLevel, setRatingLevel] = useState(0);

  const MouseOver = (n) => (e) => {
    setRatingLevel(n + 1);
  };

  const MouseOut = (e) => {
    setRatingLevel(0);
  };

  useEffect(() => {
    if (mdStatus === "idle") dispatch(getMovieDetails(id));
  }, [dispatch, mdStatus, id]);
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
              <div className="flex flex-col justify-center items-center w-[500px] h-[calc(100vh-4rem)]">
                <img
                  className="w-[350px] object-cover"
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src =
                      "https://via.placeholder.com/500/333333/FFFFFF/?text=PosterNotFound :(";
                  }}
                  alt={selectedMovie.title}
                />
                <div className="">
                  <h1 className="text-4xl font-bold">{selectedMovie.title}</h1>
                  <div className="flex justify-center items-center bg-gray-500/50 rounded-md mt-2">
                    <span className="text-xl font-light">Rate</span>
                    {[...Array(5)].map((e, i) => (
                      <span
                        key={i}
                        className={`text-2xl font-bold cursor-pointer`}
                        onMouseOver={MouseOver(i)}
                        onMouseOut={MouseOut}
                        onClick={() => {
                          console.log(i + 1);
                        }}
                      >
                        {i < ratingLevel ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="m-4 text-white bg-gradient-to-br from-gray-800/90 to-gray-900/90 w-[700px] p-4 rounded-xl flex flex-col items-end">
                <div>
                  <h1 className="text-4xl font-bold">{selectedMovie.title}</h1>
                  <p className="flex gap-4">
                    <span className="text-xl font-light">
                      Released: {selectedMovie.release_date}
                    </span>
                    <span className="text-xl font-light">
                      Budget: {selectedMovie.budget} $
                    </span>
                    <span className="text-xl font-light">
                      Revenue: {selectedMovie.revenue} $
                    </span>
                  </p>
                  <h3 className="text-2xl font-bold">Overview</h3>
                  <p className="text-lg font-light">{selectedMovie.overview}</p>
                </div>
                <div className="bg-gray-200 w-1/4">
                  <h3 className="text-2xl font-bold text-black text-center">
                    Ratings
                  </h3>
                  <Ratings />
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default MoviePage;
