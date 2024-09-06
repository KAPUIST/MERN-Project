import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiOutlineNewspaper } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
export default function DashSidebar() {
  const location = useLocation();

  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
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
          >
            로그아웃
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
