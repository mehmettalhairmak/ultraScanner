import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ScanQrFpsInterface {
  scanQrFps: 2 | 0;
}

const initialState: ScanQrFpsInterface = { scanQrFps: 2 };

export const scanQrFpsSlice = createSlice({
  name: 'scanQrFps',
  initialState,
  reducers: {
    setScanQrFps: (state, action: PayloadAction<ScanQrFpsInterface>) => {
      return action.payload;
    },
  },
});

export const { setScanQrFps } = scanQrFpsSlice.actions;
export const selectScanQrFps = (state: RootState) => state.scanQrFps.scanQrFps;

export default scanQrFpsSlice.reducer;
