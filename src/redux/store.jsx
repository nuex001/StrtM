import { configureStore } from "@reduxjs/toolkit";
import audioReducer from "./audio";
export default configureStore({
  reducer: {
    audios: audioReducer,
  },
});
