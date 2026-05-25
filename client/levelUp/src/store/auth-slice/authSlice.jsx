import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api.js";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" },
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  },
);

export const googleLogin = createAsyncThunk(
  "/auth/google",
  async ({ credential }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { credential });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Google sign-in failed" },
      );
    }
  },
);

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await api.post("/auth/logout", {});
  return response.data;
});

export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
  const response = await api.get("/auth/check-auth", {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Expires: "0",
    },
  });
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(googleLogin.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
