import axios from 'axios';
import { store } from '../redux/store';
import { successDeleteUser } from '../redux/user/userSlice';
import { resetChat } from '../redux/chat/chatSlice';

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(successDeleteUser());
      store.dispatch(resetChat());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
