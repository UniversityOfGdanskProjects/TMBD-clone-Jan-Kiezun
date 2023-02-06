import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedMovie } from "../../features/moviesTMDB/moviesSlice";
import { setMdStatus } from "../../features/moviesTMDB/moviesSlice";
const API_KEY = process.env.REACT_APP_API_KEY;

function MovieCard({ movie }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      className="w-[250px] max-h-[50%] bg-white rounded-lg shadow-lg select-none
              hover:shadow-2xl transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105
              cursor-pointer"
      key={movie.id}
      onClick={() => {
        dispatch(setMdStatus("idle"));
        dispatch(setSelectedMovie(movie));
        navigate(`/movie/${movie.id}`);
      }}
    >
      <div
        className="h-full flex flex-col items-center text-black text-md font-bold
    "
      >
        <img
          className="w-full h-3/4 object-cover rounded-t-lg"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src =
              "https://via.placeholder.com/500/333333/FFFFFF/?text=PosterNotFound :(";
          }}
          alt={movie.title}
        />
        <div className="p-2">
          <h1 className="text-lg font-bold ">{movie.title}</h1>
          <p className="text-sm">{movie.tagline}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
