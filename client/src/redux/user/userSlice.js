import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startSignIn: (state) => {
      state.loading = true;
      state.error = null;
    },
    successSignIn: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    failedSignIn: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    startDeleteUser: (state) => {
      state.loading = true;
      state.error = null;
    },
    successDeleteUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    failedDeleteUser: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startSignIn,
  successSignIn,
  failedSignIn,
  startDeleteUser,
  successDeleteUser,
  failedDeleteUser,
} = userSlice.actions;

export default userSlice.reducer;
