import axios from 'axios';
import { store } from '../redux/store';
import { successDeleteUser } from '../redux/user/userSlice';

const axiosInstance = axios.create({
  timeout: 10000,
});
axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(successDeleteUser());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
