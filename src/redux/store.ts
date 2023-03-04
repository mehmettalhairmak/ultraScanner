import { configureStore } from '@reduxjs/toolkit';
import scanQrFpsReducer from './slices/scanQrFpsSlice';

export const store = configureStore({
  reducer: {
    scanQrFps: scanQrFpsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
