import React from "react";
import NavBar from "../NavBar";

function StatsPage() {
  return (
    <div>
      <NavBar />
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col text-white text-2xl font-bold bg-gradient-to-br from-yellow-300 to-yellow-400">
        <div className="w-screen">
          <div className="text-4xl font-bold text-center my-4 mx-auto p-2 rounded-lg bg-slate-500 w-[300px]">
            Stats Page
          </div>
        </div>
        <div
          className="
        "
        >
          <span>Movies stats</span>
          <div>
            <span>Most popular movie</span>
          </div>
          <div>
            <span>Least popular movie</span>
          </div>
          <div>
            <span>Highest rated movie</span>
          </div>
          <div>
            <span>Lowest rated movie</span>
          </div>
          <div>
            <span>Movie with the most ratings</span>
          </div>
          <div>
            <span>Most popular genre</span>
          </div>
          <div>
            <span>Least popular genre</span>
          </div>
        </div>
        <div>
          <span>Users stats</span>
        </div>
        <div>
          <span>Ratings stats</span>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
