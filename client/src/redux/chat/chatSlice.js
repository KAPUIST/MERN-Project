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
    startNewConversation: (state) => {
      state.loading = true;
      state.error = null;
    },

    failedNewConversation: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 메시지 전송 (사용자가 메시지를 보낼 때)
    startSendMessage: (state) => {
      state.loading = true;
      state.error = null;
    },

    failedSendMessage: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // AI 응답 추가 (successSendMessage 이후 AI 응답을 따로 처리)
    successAiResponse: (state) => {
      state.loading = false;
      state.error = null;
    },

    // 대화방 리셋 (유저 로그아웃 시)
    resetConversation: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  startNewConversation,

  failedNewConversation,
  startSendMessage,
  failedSendMessage,
  successAiResponse, // AI 응답 처리 액션
  resetConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
