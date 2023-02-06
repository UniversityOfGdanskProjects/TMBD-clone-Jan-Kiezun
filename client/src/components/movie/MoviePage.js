import React, { useEffect, useState } from "react";
import Ratings from "./Ratings";
import { useDispatch, useSelector } from "react-redux";
import { getMovieDetails } from "../../features/moviesTMDB/moviesSlice";
import { useParams } from "react-router-dom";
import { getRatings, putRating } from "../../features/moviesTMDB/ratingSlice";

function MoviePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const movies = useSelector((state) => state.moviesSlice);
  const ratingSlice = useSelector((state) => state.ratingSlice);
  const selectedMovie = movies.selectedMovie;
  const mdStatus = movies.mdStatus;
  const users = useSelector((state) => state.usersSlice);
  const user = users.user;

  const currentUsersRating = parseInt(
    (
      ratingSlice.ratings.find((rating) => rating.user_id === user.id) || {
        rating: "0",
      }
    ).rating.toString()[0]
  );

  const [ratingLevel, setRatingLevel] = useState(currentUsersRating);

  const MouseOver = (n) => (e) => {
    setRatingLevel(n + 1);
  };

  const MouseOut = (e) => {
    setRatingLevel(currentUsersRating);
  };

  useEffect(() => {
    if (mdStatus === "idle") dispatch(getMovieDetails(id));
    if (mdStatus === "idle") dispatch(getRatings(id));
    if (mdStatus === "idle") setRatingLevel(currentUsersRating);
    setTimeout(() => {
      setRatingLevel(currentUsersRating);
    }, 100);
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
                          dispatch(
                            putRating({
                              movieId: id,
                              rating: (i + 1).toString() + ".0",
                              userId: user.id,
                              timestamp: Date.now(),
                            })
                          );
                          setTimeout(() => {
                            dispatch(getRatings(id));
                          }, 20);
                          console.log((i + 1).toString() + ".0");
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
                  <span
                    className="
                  text-xl font-light
                  text-gray-400/50
                  italic
                  mb-4
                  "
                  >
                    {"'" + selectedMovie.tagline + "'"}
                  </span>
                  <p className="flex gap-4 text-gray-200">
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
                <Ratings />
                <div
                  className="
                  flex flex-col gap-2 mt-auto mr-auto
              "
                >
                  <h1 className="text-2xl font-bold">Genres</h1>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genres.length &&
                      selectedMovie.genres.map((genre) => (
                        <div
                          key={genre.id}
                          className="bg-gray-500/50 text-sm rounded-md p-1"
                        >
                          {genre}
                        </div>
                      ))}
                  </div>
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
