import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startConversationApi } from '../api/api';
import {
  startSendMessage,
  failedSendMessage,
  successAiResponse,
  resetConversation,
} from '../redux/chat/chatSlice'; // Redux actions
import { Spinner } from 'flowbite-react';

export default function Chat() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user); // 현재 유저 정보
  const { messages, loading, conversationId } = useSelector(
    (state) => state.chat
  ); // 채팅 메시지와 로딩 상태

  const [inputMessage, setInputMessage] = useState(''); // 사용자의 입력
  useEffect(() => {
    // currentUser가 null이 되면 로그아웃으로 간주하고 대화 상태 초기화
    if (!currentUser) {
      dispatch(resetConversation());
    }
  }, [currentUser, dispatch]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      const userMessage = inputMessage; // 사용자 메시지
      dispatch(startSendMessage(userMessage));
      // 서버로 메시지 전송 후 AI 응답 대기
      const res = await startConversationApi({
        conversationId,
        message: inputMessage,
      });

      dispatch(successAiResponse(res.data)); // AI 응답 추가

      setInputMessage(''); //
    } catch (error) {
      console.error(error);
      dispatch(failedSendMessage('메시지 전송중 오류가 발생했습니다.'));
    }
  };
  return (
    <div className="flex flex-col max-w-2xl mx-auto p-6 h-screen">
      <div className="flex-grow overflow-y-auto bg-white shadow-md rounded-lg p-4 space-y-4">
        {/* 메시지 리스트 출력 */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'user' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center">
            <Spinner aria-label="로딩중 ..." />
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex mt-4 ">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow p-2 border rounded-lg shadow-sm focus:outline-none focus:ring"
          placeholder="메시지를 입력하세요..."
        />
        <button
          type="submit"
          className="ml-2 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
          disabled={loading} // 로딩 중일 때 전송 버튼 비활성화
        >
          {loading ? '전송 중' : '전송'}
        </button>
      </form>
    </div>
  );
}
