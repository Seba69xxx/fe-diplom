import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import trainsReducer from './slices/trainsSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    trains: trainsReducer,
    order: orderReducer,
  },
});