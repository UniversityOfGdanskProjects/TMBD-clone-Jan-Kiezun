﻿import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

const apiURL = "http://localhost:8080/movies/comments";

const initialState = {
  comments: [],
  status: "idle",
  error: null,
};

export const getComments = createAsyncThunk(
  "comment/getComments",
  async (movieId) => {
    const response = await axios.get(apiURL + "/" + movieId);
    return response.data;
  }
);

export const editComment = createAsyncThunk(
  "comment/editComment",
  async (comment) => {
    const response = await axios.patch(apiURL + "/edit", comment);
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (comment) => {
    const { id, movie_id } = comment;
    console.log("deleteComment", comment);
    const response = await axios.delete(
      apiURL + "/delete/" + id + "/" + movie_id
    );
    return response.data;
  }
);

export const postComment = createAsyncThunk(
  "comment/postComment",
  async (comment) => {
    const response = await axios.post(apiURL + "/add", comment);
    return response.data;
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComment: (state, action) => {
      state.comment = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(postComment.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(postComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(editComment.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(editComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteComment.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setComment, setStatus } = commentSlice.actions;
