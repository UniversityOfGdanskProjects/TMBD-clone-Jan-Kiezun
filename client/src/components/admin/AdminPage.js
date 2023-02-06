import React from "react";
import NavBar from "../NavBar";

function AdminPage() {
  return (
    <div>
      <NavBar />
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-white text-2xl font-bold bg-gradient-to-br from-gray-400 to-gray-500">
        <h1>AdminPage</h1>
      </div>
    </div>
  );
}

export default AdminPage;
