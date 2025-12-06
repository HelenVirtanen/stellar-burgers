import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TRegisterData,
  TLoginData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie, getCookie } from '../utils/cookie';
import { RootState } from '../services/store';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: any | null;
  loading: boolean;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loading: false
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    const response = await loginUserApi({ email, password });
    if (!response?.success) {
      return rejectWithValue(response || 'Ошибка авторизации');
    }

    const { user, refreshToken, accessToken } = response;
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/registerUser',
  async (creds, { rejectWithValue }) => {
    const response = await registerUserApi(creds);
    if (!response.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;
    localStorage.setItem('refreshToken', String(refreshToken));
    setCookie('accessToken', String(accessToken));
    return user;
  }
);

export const fetchUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response.success) return rejectWithValue(response);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'users/updateUser',
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'users/logoutUser',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgot-password',
  async (data: { email: string }) => {
    await forgotPasswordApi(data);
  }
);

export const resetPassword = createAsyncThunk(
  'user/reset-password',

  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
    },
    setUser: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.loading = false;
        state.loginUserError = action.payload;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.loginUserError = action.payload;
      });
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loginUserError = action.payload;
        state.isAuthChecked = true;
        state.loading = false;
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.loginUserError = action.payload;
      });
  }
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    const token = getCookie('accessToken');
    if (token) {
      await dispatch(fetchUser()).finally(() => {
        dispatch(userSlice.actions.authChecked());
      });
    } else {
      dispatch(userSlice.actions.authChecked());
    }
  }
);

export const getUserData = (state: RootState) => state.user.data;
export const getUserLoading = (state: RootState) => state.user.loading;
export const isAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const isAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const getError = (state: RootState) => state.user.loginUserError;

export const { setUser } = userSlice.actions;
