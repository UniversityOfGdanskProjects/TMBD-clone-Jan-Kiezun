import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

const apiURL = "http://localhost:8080/users";

const initialState = {
  user: [],
  loginStatus: "not logged in",
  error: null,
};

export const loginUser = createAsyncThunk("users/loginUser", async (user) => {
  const checkCredentials = await axios.post(apiURL + "/login", user);
  if (!checkCredentials.data) {
    return;
  }
  const userData = await axios.get(apiURL + "/" + user.id);
  console.log(userData);
  return userData.data;
});

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (user) => {
    const checkCredentials = await axios.post(apiURL + "/register", user);
    if (checkCredentials.data) {
      return;
    }
    const userData = await axios.post(apiURL, user);
    return userData.data;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      state.loginStatus = "not logged in";
      state.user = [];
    },
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loginStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (!action.payload) {
          state.loginStatus = "failed";
          state.error = "Invalid credentials";
          return;
        }
        state.user = action.payload;
        state.loginStatus = "logged in";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(registerUser.pending, (state, action) => {
        state.loginStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (!action.payload) {
          state.loginStatus = "failed";
          state.error = "Found user with this id";
          return;
        }
        state.user = action.payload;
        state.loginStatus = "logged in";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logoutUser, setLoginStatus } = usersSlice.actions;
