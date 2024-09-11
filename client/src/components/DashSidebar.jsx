import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiOutlineNewspaper } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteUserApi } from '../api/userApi';
import {
  startDeleteUser,
  failedDeleteUser,
  successDeleteUser,
} from '../redux/user/userSlice';
export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleLogout = async () => {
    dispatch(startDeleteUser());
    try {
      await deleteUserApi();
      dispatch(successDeleteUser());
      navigate('/');
    } catch (error) {
      if (error.response) {
        dispatch(
          failedDeleteUser(
            error.response.data.message || '로그아웃 중 오류가 발생했습니다.'
          )
        );
      } else {
        dispatch(failedDeleteUser(error.message));
      }
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/dashboard?tab=profile"
            active={tab === 'profile'}
            icon={HiUser}
            label={'User'}
            labelColor="dark"
          >
            프로필
          </Sidebar.Item>

          <Sidebar.Item
            as={Link}
            to="/dashboard?tab=posts"
            icon={HiOutlineNewspaper}
            labelColor="dark"
            label={'Post'}
          >
            나의 기록
          </Sidebar.Item>

          <Sidebar.Item
            icon={HiArrowSmRight}
            labelColor="dark"
            className="cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
