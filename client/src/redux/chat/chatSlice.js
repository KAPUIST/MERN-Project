import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 새로운 대화 시작
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 성공 처리 (로딩 중단)
    success: (state) => {
      state.loading = false;
      state.error = null;
    },
    // 실패 처리 (로딩 중단 및 에러 설정)
    failure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 대화방 리셋 (유저 로그아웃 시)
    resetChat: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const { startLoading, success, failure, resetChat } = chatSlice.actions;

export default chatSlice.reducer;
