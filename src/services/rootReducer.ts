import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredients';
import { constructorSlice } from '../slices/burger-constructor';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer
});
