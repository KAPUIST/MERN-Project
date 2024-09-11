import { useState, useEffect } from 'react';
import { Card, Spinner, Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { getUserChatRoomsApi } from '../api/chatApi';
export default function DashChatRoomList() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await getUserChatRoomsApi(); // API 호출
        setChatRooms(response.data); // 성공적으로 데이터 설정
        setLoading(false);
      } catch (error) {
        setError('채팅방을 불러오는 중 문제가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner aria-label="로딩 중..." />
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <Alert color="red" className="text-center mt-10">
        {error}
      </Alert>
    );
  }
  const handleCardClick = (chatRoomId) => {
    navigate(`/chat/${chatRoomId}`); // 채팅방으로 경로 이동
  };
  return (
    <div className="mx-auto max-w-6xl p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-2xl">채팅방 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chatRooms.map((chatRoom) => (
          <Card
            key={chatRoom._id}
            onClick={() => handleCardClick(chatRoom._id)} // 클릭 시 해당 채팅방으로 이동
            className="max-w-sm mx-auto cursor-pointer"
          >
            <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
              채팅방 아이디: {chatRoom._id}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              생성일: {new Date(chatRoom.createdAt).toLocaleString()}{' '}
              {/* 생성일 표시 */}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
