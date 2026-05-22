import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlombierSettingsState {
  businessName: string;
  experienceYears: number;
}

const initialState: PlombierSettingsState = {
  businessName: 'Plombier Tunisie',
  experienceYears: 15,
};

const plombierSettingsSlice = createSlice({
  name: 'plombierSettings',
  initialState,
  reducers: {
    updatePlombierSettings: (
      state,
      action: PayloadAction<Partial<PlombierSettingsState>>,
    ) => {
      if (action.payload.businessName !== undefined) {
        state.businessName = action.payload.businessName;
      }
      if (action.payload.experienceYears !== undefined) {
        state.experienceYears = action.payload.experienceYears;
      }
    },
  },
});

export const { updatePlombierSettings } = plombierSettingsSlice.actions;

export default plombierSettingsSlice.reducer;
