import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startChatApi, getChatRoomMessagesApi } from '../api/chatApi';
import { useParams } from 'react-router-dom';
import { startLoading, success, failure } from '../redux/chat/chatSlice';
import { Alert, Spinner, Card } from 'flowbite-react';

export default function Chat() {
  const { chatRoomId: paramChatRoomId } = useParams();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.chat);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [chatRoomId, setChatRoomId] = useState(paramChatRoomId || null);

  const messageContainerRef = useRef(null);

  // 스크롤 하단으로 이동
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  // 메시지 로드
  useEffect(() => {
    if (!chatRoomId) return;
    dispatch(startLoading());
    const loadMessages = async () => {
      try {
        const res = await getChatRoomMessagesApi(chatRoomId, 1); // 처음 1페이지를 가져옴
        setMessages(res.data.reverse()); // 최신순으로 메시지 추가
        setPage(2); // 다음 페이지 설정
        setTimeout(() => scrollToBottom(), 100); // 로드 후 스크롤 하단으로 이동
        dispatch(success());
      } catch (error) {
        console.error(error);
        dispatch(failure('메시지를 불러오는 중 오류가 발생했습니다.'));
      }
    };
    loadMessages();
  }, [chatRoomId, dispatch]);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 100); // 메시지가 추가될 때마다 하단으로 스크롤
  }, [messages, loading]);

  // chatRoomId 설정
  useEffect(() => {
    if (chatRoomId) {
      setChatRoomId(chatRoomId);
    }
  }, [chatRoomId]);

  // 스크롤이 최상단에 도달 시 이전 메시지 불러오기
  useEffect(() => {
    const handleScroll = async () => {
      if (!messageContainerRef.current || loading || !hasMoreMessages) return;

      const { scrollTop } = messageContainerRef.current;
      if (scrollTop === 0) {
        try {
          const res = await getChatRoomMessagesApi(chatRoomId, page); // 페이지에 맞춰 메시지 가져오기
          if (res.data.length > 0) {
            setMessages((prevMessages) => [
              ...res.data.reverse(),
              ...prevMessages,
            ]); // 기존 메시지 위로 추가
            setPage((prevPage) => prevPage + 1); // 다음 페이지 설정
          } else {
            setHasMoreMessages(false); // 더 이상 메시지가 없으면 중단
          }
        } catch (error) {
          console.error(
            '이전 메시지를 불러오는 중 오류가 발생했습니다.',
            error
          );
        }
      }
    };

    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (messageContainer) {
        messageContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [chatRoomId, loading, hasMoreMessages, page]);

  // 메시지 전송 및 AI 응답 도착 시 하단으로 스크롤
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      dispatch(startLoading());
      const res = await startChatApi({
        chatRoomId,
        message: inputMessage,
      });

      const userMsg = res.data.userMessage;
      const aiMsg = res.data.aiMessage;

      setMessages((prevMessages) => [...prevMessages, userMsg, aiMsg]);
      setInputMessage('');
      scrollToBottom(); // 메시지 전송 후 스크롤 하단으로
      dispatch(success());
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      dispatch(failure('메시지 전송 중 오류가 발생했습니다.'));
    }
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto p-6 h-[90vh] bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
      {error && (
        <Alert color="red" className="p-3 rounded-lg mb-4 mx-auto">
          {error}
        </Alert>
      )}

      <div
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto bg-white dark:bg-gray-700 rounded-lg p-4 space-y-4 shadow-inner"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'user' ? 'justify-start' : 'justify-end'
            } mb-4`}
          >
            <div
              className={`p-4 text-sm rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white dark:bg-blue-600'
                  : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
              }`}
            >
              {msg.role === 'ai' && msg.message.includes('피드백') ? (
                <Card className="p-4 mb-4">
                  <h4 className="font-bold mb-2 text-lg">피드백</h4>
                  <p>
                    {msg.message.split('수정 후:')[0].replace('피드백: ', '')}
                  </p>
                  <h4 className="font-bold mt-4 mb-2 text-lg">수정 후</h4>
                  <p>{msg.message.split('수정 후:')[1]}</p>
                </Card>
              ) : (
                msg.message
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center">
            <Spinner aria-label="로딩 중..." />
            <span className="ml-2">AI가 답변을 준비 중입니다...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex mt-4">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-600 dark:text-white resize-none"
          placeholder="메시지를 입력하세요..."
          rows="3"
          style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white py-2 px-7 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? '전송 중' : '전송'}
        </button>
      </form>
    </div>
  );
}
