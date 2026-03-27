import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateNotification(state, action) {
      return action.payload;
    },
    removeNotification() {
      return null;
    },
  },
});

const { updateNotification, removeNotification } = notificationSlice.actions;

export const setNotification = (message, seconds) => {
  return (dispatch) => {
    dispatch(updateNotification(message));
    setTimeout(() => dispatch(removeNotification()), seconds * 1000);
  };
};
export default notificationSlice.reducer;
