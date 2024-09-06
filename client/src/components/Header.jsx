import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';

import { toggleTheme } from '../redux/theme/themeSlice';
import axios from 'axios';
import {
  startDeleteUser,
  successDeleteUser,
  failedDeleteUser,
} from '../redux/user/userSlice';
export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleLogout = async () => {
    dispatch(startDeleteUser());
    try {
      await axios.delete('/api/auth/signout');
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
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r  from-indigo-500 rounded-lg via-purple-500 to-Blue-500 text-white">
          루크의
        </span>
        자기소개소
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="검색..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          // 이미지를 등록해줄수있어야함
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img="/public/cat.jpeg" rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium ">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>프로필</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" pill>
              로그인
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
