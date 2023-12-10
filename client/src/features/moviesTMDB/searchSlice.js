import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

const apiURL = "http://localhost:8080/movies";

const initialState = {
  searchedMovies: [],
  genres: [],
  searchValues: {
    searchTerm: "",
    genres: [],
    sort: "",
    order: "",
    page: 1,
  },
  smStatus: "idle",
  gStatus: "idle",
  error: null,
};

export const getSearchedMovies = createAsyncThunk(
  "movies/getSearchedMovies",
  async ({ searchTerm = "", genres = [], sort = "", order = "", page = 1 }) => {
    const queryGenres = _.join(genres, ",");
    console.log("searchTerm", searchTerm);
    const response = await axios.get(
      apiURL +
        `/search?${searchTerm ? "q=" + searchTerm : ""}${
          genres && genres.length ? "&genres=" + queryGenres : ""
        }${sort ? "&sort=" + sort : ""}${order ? "&order=" + order : ""}${
          page ? "&page=" + page : ""
        }}`
    );
    return response.data;
  }
);

export const getGenres = createAsyncThunk("movies/getGenres", async () => {
  const response = await axios.get(apiURL + "/genres");
  return response.data;
});

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchedMovies: (state, action) => {
      state.searchedMovies = action.payload;
    },
    setSmStatus: (state, action) => {
      state.smStatus = action.payload;
    },
    resetSearch: (state, action) => {
      state.searchedMovies = [];
      state.smStatus = "idle";
      state.error = null;
    },
    setSearchValues: (state, action) => {
      state.searchValues = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchedMovies.pending, (state, action) => {
        state.smStatus = "loading";
      })
      .addCase(getSearchedMovies.fulfilled, (state, action) => {
        state.smStatus = "succeeded";
        state.searchedMovies = action.payload;
      })
      .addCase(getSearchedMovies.rejected, (state, action) => {
        state.smStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(getGenres.pending, (state, action) => {
        state.gStatus = "loading";
      })
      .addCase(getGenres.fulfilled, (state, action) => {
        state.gStatus = "succeeded";
        state.genres = action.payload;
      })
      .addCase(getGenres.rejected, (state, action) => {
        state.gStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSearchedMovies, setSmStatus, resetSearch, setSearchValues } =
  searchSlice.actions;
