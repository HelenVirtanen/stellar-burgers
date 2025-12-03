import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredients';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer
});
