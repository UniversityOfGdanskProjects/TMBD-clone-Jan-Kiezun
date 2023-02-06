import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
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
    console.log(movieId);
    const response = await axios.get(apiURL + "/" + movieId);
    return response.data;
  }
);

export const editComment = createAsyncThunk(
  "comment/editComment",
  async (comment) => {
    const response = await axios.put(apiURL + "/edit", comment);
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (comment) => {
    const response = await axios.put(apiURL + "/delete", comment);
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

      .addCase(editComment.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = state.comments.map((comment) => {
          if (comment.user_id === action.payload.user_id) {
            return action.payload;
          } else {
            return comment;
          }
        });
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
        state.comments = action.payload;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setComment, setStatus } = commentSlice.actions;
