import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

const apiURL = "http://localhost:8080/stats";

const initialState = {
  mostPopularMovie: null,
  leastPopularMovie: null,
  HighestRatedMovie: null,
  LowestRatedMovie: null,
  movieWithMostRatings: null,
  mostPopularGenre: null,
  leastPopularGenre: null,
  status: "idle",
  error: null,
};

export const getStats = createAsyncThunk("stat/getStats", async () => {
  const response = await axios.get(apiURL + "/getStats");
  return response.data;
});

export const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mostPopularMovie = action.payload.popularMovie;
        state.leastPopularMovie = action.payload.unPopularMovie;
        state.HighestRatedMovie = action.payload.highRatedMovie;
        state.LowestRatedMovie = action.payload.lowRatedMovie;
        state.movieWithMostRatings = action.payload.mostRatingsMovie;
        state.mostPopularGenre = action.payload.mostPopularGenre;
        state.leastPopularGenre = action.payload.leastPopularGenre;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
