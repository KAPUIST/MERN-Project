import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button, Spinner, Alert } from 'flowbite-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  startDeleteUser,
  successDeleteUser,
  failedDeleteUser,
} from '../redux/user/userSlice';
export default function DashProfile() {
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    dispatch(startDeleteUser());
    try {
      await axios.delete('/api/user/me');
      dispatch(successDeleteUser());
      navigate('/');
    } catch (error) {
      if (error.response) {
        dispatch(
          failedDeleteUser(
            error.response.data.message || '회원탈퇴 중 오류가 발생했습니다.'
          )
        );
      } else {
        dispatch(failedDeleteUser(error.message));
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-2xl">프로필</h1>
      <div className="flex flex-col items-center">
        <div className="w-52 h-52 ">
          <img
            src="/cat.jpeg"
            alt="user"
            className="rounded-full w-full h-full object-cover border-2 border-l-indigo-200"
          />
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {currentUser.username}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentUser.email}
        </span>
        <div className="mt-4 flex space-x-3 lg:mt-6">
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={handleDeleteUser}
            disabled={loading === true}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">로딩 중...</span>
              </>
            ) : (
              '회원탈퇴'
            )}
          </Button>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="red">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
