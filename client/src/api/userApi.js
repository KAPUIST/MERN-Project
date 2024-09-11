import axiosInstance from './axiosInterceptor';

export const deleteUserApi = async () => {
  return await axiosInstance.delete('/api/auth/signout');
};
