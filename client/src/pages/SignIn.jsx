import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  startSignIn,
  successSignIn,
  failedSignIn,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessages } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(failedSignIn('빈 칸을 모두 기입해 주세요!'));
    }
    try {
      dispatch(startSignIn());
      const res = await axios.post('/api/auth/signin', formData);
      dispatch(successSignIn(res.data.data));
      navigate('/');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          // 백엔드에서 중복 데이터로 인해 409 에러 발생 시
          dispatch(
            failedSignIn('이미 사용 중인 이메일 또는 사용자 이름입니다.')
          );
        } else {
          dispatch(
            failedSignIn(
              error.response.data.message || '회원가입 중 오류가 발생했습니다.'
            )
          );
        }
      } else {
        dispatch(failedSignIn(error.message));
      }
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <Link to="/" className="font-semibold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 rounded-lg via-purple-500 to-Blue-500 text-white">
              루크의
            </span>
            자기소개소
          </Link>
          <p className="text-sm mt-6">입 벌려라, 자기소개서 훈수 들어간다잉.</p>
          <p className="text-sm">- ChatGPT -</p>
        </div>
        {/* 왼쪽 */}

        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div>
              <Label value="이메일" />
              <TextInput
                type="email"
                placeholder="example@example.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="비밀번호" />
              <TextInput
                type="password"
                placeholder="1q2w3e4r"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading === true}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">로딩 중....</span>
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </form>
          <div className="text-sm mt-5 flex gap-2">
            <span>계정이 없으신가요?</span>
            <Link to="/sign-up" className="text-blue-500">
              회원가입
            </Link>
          </div>
          {errorMessages && (
            <Alert className="mt-5" color="red">
              {errorMessages}
            </Alert>
          )}
        </div>
        {/* 오른쪽 */}
      </div>
    </div>
  );
}
