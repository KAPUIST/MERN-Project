import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversationId: null,
  messages: [],
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
      state.messages = [];
      state.conversationId = null; // 새로운 대화 시작 시 conversationId 초기화
    },

    failedNewConversation: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 메시지 전송 (사용자가 메시지를 보낼 때)
    startSendMessage: (state, action) => {
      state.loading = true;
      state.error = null;
      state.messages.push({
        role: 'user', // 사용자 메시지로 role 설정
        content: action.payload, // 메시지 내용
      });
    },

    failedSendMessage: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // AI 응답 추가 (successSendMessage 이후 AI 응답을 따로 처리)
    successAiResponse: (state, action) => {
      state.loading = false;
      state.error = null;
      state.conversationId = action.payload.conversationId;
      // AI 응답을 메시지 배열에 추가
      state.messages.push({
        role: 'ai',
        content: action.payload.aiResponse, // AI 응답 내용
      });
    },

    // 대화방 리셋 (유저 로그아웃 시)
    resetConversation: (state) => {
      state.conversationId = null;
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  startNewConversation,
  successNewConversation,
  failedNewConversation,
  startSendMessage,

  failedSendMessage,
  successAiResponse, // AI 응답 처리 액션
  resetConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
