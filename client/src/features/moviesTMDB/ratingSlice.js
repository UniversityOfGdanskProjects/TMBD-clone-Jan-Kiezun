import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

const apiURL = "http://localhost:8080/movies/ratings";

const initialState = {
  ratings: [],
  status: "idle",
  error: null,
};

export const getRatings = createAsyncThunk(
  "rating/getRatings",
  async (movieId) => {
    console.log(movieId);
    const response = await axios.get(apiURL + "/" + movieId);
    return response.data;
  }
);

export const putRating = createAsyncThunk(
  "rating/putRating",
  async (rating) => {
    const response = await axios.put(apiURL + "/set", rating);
    return response.data;
  }
);

export const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(putRating.pending, (state, action) => {
      //   state.status = "loading";
      // })
      // .addCase(putRating.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.ratings = action.payload;
      // })
      // .addCase(putRating.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.error.message;
      // })

      .addCase(getRatings.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getRatings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ratings = action.payload;
      })
      .addCase(getRatings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setRating, setStatus } = ratingSlice.actions;
