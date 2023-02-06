import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/moviesTMDB/usersSlice";
import { resetSearch } from "../features/moviesTMDB/searchSlice";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.usersSlice.user);
  return (
    <div
      className=" w-full h-16  bg-gradient-to-br from-gray-800 to-gray-900 flex justify-center items-center text-white text-2xl font-bold select-none
    
  "
    >
      <div className="w-3/4 flex justify-between">
        <div
          className="cursor-pointer border-b-2 border-black hover:border-white transition duration-200 ease-in-out"
          onClick={() => navigate("/home")}
        >
          Home
        </div>
        <div
          className="cursor-pointer border-b-2 border-black hover:border-white transition duration-200 ease-in-out"
          onClick={() => {
            dispatch(resetSearch());
            navigate("/search");
          }}
        >
          Search
        </div>
        <div
          className="cursor-pointer border-b-2 border-black hover:border-white transition duration-200 ease-in-out"
          onClick={() => {
            dispatch(resetSearch());
            navigate("/stats");
          }}
        >
          Stats
        </div>
        {
          // if user role is admin show admin panel
        }
        {user.role === "admin" && (
          <div
            className="cursor-pointer border-b-2 border-black hover:border-white transition duration-200 ease-in-out"
            onClick={() => {
              dispatch(resetSearch());
              navigate("/admin");
            }}
          >
            AdminPage
          </div>
        )}
        <div
          className="cursor-pointer border-b-2 border-black hover:border-white transition duration-200 ease-in-out"
          onClick={() => {
            dispatch(logoutUser());
            navigate("/login");
          }}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

export default NavBar;
