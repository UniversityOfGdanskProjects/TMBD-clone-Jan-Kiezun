import React from "react";
import NavBar from "../NavBar";
import AddMovieForm from "./AddMovieForm";

function AdminPage() {
  return (
    <div>
      <NavBar />
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col  items-center text-white text-2xl font-bold bg-gradient-to-br from-gray-400 to-gray-500">
        <h2>AddMovie</h2>
        <AddMovieForm />
      </div>
    </div>
  );
}

export default AdminPage;
