import React from "react";
const API_KEY = process.env.REACT_APP_API_KEY;

function MovieCard({ movie }) {
  return (
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
  );
}

export default MovieCard;
