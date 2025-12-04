import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  selectedOrder: TOrder | null;
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  selectedOrder: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feeds/getFeeds', async () => {
  try {
    const feeds = await getFeedsApi();
    return feeds;
  } catch (err: any) {
    return err.message;
  }
});

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    }
  },
  selectors: {
    getFeeds: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getSelectedOrder: (state) => state.selectedOrder,
    getLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const {
  getFeeds,
  getTotal,
  getTotalToday,
  getSelectedOrder,
  getLoading
} = feedSlice.selectors;
