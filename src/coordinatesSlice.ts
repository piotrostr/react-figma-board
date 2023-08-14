import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface Coordinates {
  x: number;
  y: number;
}

export type CoordinatesState = {
  map?: {
    [id: string]: {
      coordinates?: Coordinates;
      prevCoordinates?: Coordinates;
    };
  };
  initialized: boolean;
};

export type InitializeCoordinatesPayload = {
  id: string;
  coordinates: Coordinates;
  prevCoordinates: Coordinates;
};

export type UpdateCoordinatesPayload = {
  id: string;
  coordinates?: Coordinates;
  prevCoordinates?: Coordinates;
};

const initialState: CoordinatesState = {
  initialized: false,
};

export const slice = createSlice({
  name: "coordinates",
  initialState,
  reducers: {
    initializeCoordinates: (
      state,
      action: PayloadAction<InitializeCoordinatesPayload>,
    ) => {
      // TODO!!
      // this should accept the complete state of all of the components and loop
      // through here only once
      if (!state.map) {
        state.map = {};
      }
      state.map[action.payload.id] = {
        coordinates: action.payload.coordinates,
        prevCoordinates: action.payload.prevCoordinates,
      };
      state.initialized = true;
    },
    updateCoordinates: (
      state,
      action: PayloadAction<UpdateCoordinatesPayload>,
    ) => {
      if (!state.initialized || !state?.map) {
        return;
      }
      action.payload?.coordinates &&
        (state.map[action.payload.id].coordinates = action.payload.coordinates);
      action.payload?.prevCoordinates &&
        (state.map[action.payload.id].prevCoordinates =
          action.payload.prevCoordinates);
    },
  },
});

export const { initializeCoordinates, updateCoordinates } = slice.actions;

export default slice.reducer;
