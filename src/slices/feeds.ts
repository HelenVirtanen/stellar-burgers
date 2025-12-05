import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../services/store';

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

export const getOrderByNumber = createAsyncThunk(
  'feeds/getOrderByNumber',
  async (num: number) => {
    try {
      const selectedOrder = await getOrderByNumberApi(num);
      return selectedOrder;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
);

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    }
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
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const getFeeds = (state: RootState) => state.feeds.orders;
export const getTotal = (state: RootState) => state.feeds.total;
export const getTotalToday = (state: RootState) => state.feeds.totalToday;
export const getSelectedOrder = (state: RootState) => state.feeds.selectedOrder;
export const getLoading = (state: RootState) => state.feeds.loading;
