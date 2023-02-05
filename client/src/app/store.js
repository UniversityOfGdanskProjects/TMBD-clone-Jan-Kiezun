import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { moviesSlice } from "../features/moviesTMDB/moviesSlice";
import { usersSlice } from "../features/moviesTMDB/usersSlice";

export const store = configureStore({
  reducer: {
    moviesSlice: moviesSlice.reducer,
    usersSlice: usersSlice.reducer,
  },
  middleware: [thunk, logger],
});
