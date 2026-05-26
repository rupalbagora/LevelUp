import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
  },
);

export const loginUser = createAsyncThunk("/auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      formData,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed" });
  }
});

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`,
    {},
    { withCredentials: true },
  );
  return response.data;
});

export const checkAuth = createAsyncThunk("/auth/checkauth", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
      {
        withCredentials: true,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Expires: "0",
        },
      },
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Auth check failed" });
  }
});

export const googleLogin = createAsyncThunk(
  "/auth/google-login",
  async ({ credential }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        { credential },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Google sign-in failed" });
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
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
      

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      // .addCase(loginUser.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.user = action.payload.success ? action.payload.user : null;
      //   state.isAuthenticated = action.payload.success ? true : false;
      // })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          // ✅ Token store karo
          localStorage.setItem("token", action.payload.user.token);
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
      

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(checkAuth.rejected, (state) => {
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
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem("token", action.payload.user.token);
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(googleLogin.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
