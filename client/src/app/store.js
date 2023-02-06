import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { moviesSlice } from "../features/moviesTMDB/moviesSlice";
import { usersSlice } from "../features/moviesTMDB/usersSlice";
import { searchSlice } from "../features/moviesTMDB/searchSlice";
import { ratingSlice } from "../features/moviesTMDB/ratingSlice";
import { commentSlice } from "../features/moviesTMDB/commentSlice";

export const store = configureStore({
  reducer: {
    moviesSlice: moviesSlice.reducer,
    usersSlice: usersSlice.reducer,
    searchSlice: searchSlice.reducer,
    ratingSlice: ratingSlice.reducer,
    commentSlice: commentSlice.reducer,
  },
  middleware: [thunk, logger],
});
