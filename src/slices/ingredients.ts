import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsState: (state) => state,
    getIngredientsLoadingState: (state) => state.loading,
    getIngredients: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const {
  getIngredientsState,
  getIngredientsLoadingState,
  getIngredients
} = ingredientsSlice.selectors;
