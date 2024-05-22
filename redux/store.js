import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import userSlice from "./userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      modals: modalReducer,
      user: userSlice,
    },
  });
};

