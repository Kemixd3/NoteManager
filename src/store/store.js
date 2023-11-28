// store.js

import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    // other reducers...
  },
});
