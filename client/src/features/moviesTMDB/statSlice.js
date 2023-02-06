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
