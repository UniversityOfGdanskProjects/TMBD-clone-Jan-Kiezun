﻿import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

const apiURL = "http://localhost:8080/movies";

const initialState = {
  popularMovies: [],
  selectedMovie: null,
  mdStatus: "idle",
  popStatus: "idle",
  error: null,
};

export const getPopularMovies = createAsyncThunk(
  "movies/getPopularMovies",
  async (page = 1) => {
    const response = await axios.get(apiURL + "/popular?page=" + page);
    return response.data;
  }
);

export const getMovieDetails = createAsyncThunk(
  "movies/getMovieDetails",
  async (id) => {
    const response = await axios.get(apiURL + "/" + id);
    return response.data;
  }
);

export const addMovie = createAsyncThunk("movies/addMovie", async (movie) => {
  const response = await axios.post(apiURL + "/add", movie);
  return response.data;
});

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id) => {
    const response = await axios.delete(apiURL + "/delete/" + id);
    return response.data;
  }
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, movie }) => {
    const response = await axios.patch(apiURL + "/update/" + id, movie);
    return response.data;
  }
);

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    setMdStatus: (state, action) => {
      state.mdStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopularMovies.pending, (state, action) => {
        state.popStatus = "loading";
      })
      .addCase(getPopularMovies.fulfilled, (state, action) => {
        state.popStatus = "succeeded";
        state.popularMovies = action.payload;
      })
      .addCase(getPopularMovies.rejected, (state, action) => {
        state.popStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(getMovieDetails.pending, (state, action) => {
        state.mdStatus = "loading";
      })
      .addCase(getMovieDetails.fulfilled, (state, action) => {
        state.mdStatus = "succeeded";
        state.selectedMovie = action.payload;
      })
      .addCase(getMovieDetails.rejected, (state, action) => {
        state.mdStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(addMovie.pending, (state, action) => {
        state.mdStatus = "loading";
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.mdStatus = "succeeded";
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.mdStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteMovie.pending, (state, action) => {
        state.mdStatus = "loading";
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.mdStatus = "succeeded";
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.mdStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(updateMovie.pending, (state, action) => {
        state.mdStatus = "loading";
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.mdStatus = "succeeded";
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.mdStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSelectedMovie, setMdStatus } = moviesSlice.actions;
