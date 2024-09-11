import axiosInstance from './axiosInterceptor';

export const startChatApi = async (data) => {
  const res = await axiosInstance.post('/api/chat/message', data);
  return res.data;
};
export const getUserChatRoomsApi = async () => {
  const res = await axiosInstance.get('/api/chat/rooms');
  return res.data;
};
export const getChatRoomMessagesApi = async (chatRoomId) => {
  const res = await axiosInstance.get(`/api/chat/rooms/${chatRoomId}/messages`);
  return res.data;
};
