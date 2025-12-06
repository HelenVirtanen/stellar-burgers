import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

type TOrderState = {
  orders: TOrder[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TOrderState = {
  orders: [],
  loading: false,
  error: null,
  orderModalData: null,
  orderRequest: false
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    try {
      const createdOrder = await orderBurgerApi(ingredients);
      return { order: createdOrder.order, name: createdOrder.name };
    } catch (err: any) {
      return err.message;
    }
  }
);

export const fetchOrders = createAsyncThunk('order/getOrders', async () => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err: any) {
    return err.message;
  }
});

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id: number) => {
    try {
      const response = await getOrderByNumberApi(id);
      console.log('order by id', response.orders[0]);
      return response.orders[0];
    } catch (err: any) {
      return err.message;
    }
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.orders.push(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [action.payload];
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [...action.payload];
      });
  }
});

export const getOrders = (state: RootState) => state.orders.orders;
export const getOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
export const getOrderRequest = (state: RootState) => state.orders.orderRequest;
export const getOrderLoading = (state: RootState) => state.orders.loading;

export const { clearOrderModal } = orderSlice.actions;
