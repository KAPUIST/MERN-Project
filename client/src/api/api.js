import axiosInstance from './axiosInterceptor';

export const deleteUserApi = async () => {
  return await axiosInstance.delete('/api/auth/signout');
};

export const startConversationApi = async (data) => {
  const res = await axiosInstance.post('/api/conversation', data);
  return res.data;
};
