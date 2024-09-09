import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <div className="gap-6 p-28 flex flex-col mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          <span className="px-2 py-1 bg-gradient-to-r  from-indigo-500 rounded-lg via-purple-500 to-Blue-500 text-white">
            루크의
          </span>
          자기소개소 첨삭 서비스에 오신 것을 환영합니다!
        </h1>
        <p className="text-gray-500 text-sm">
          간단한 자기소개를 업로드하시면, AI가 자동으로 첨삭해 드립니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <img
              src="/ai-read.jpg"
              alt="Feature 1"
              className="w-48 h-48 object-cover mx-auto rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-4">AI 기반 첨삭</h3>
            <p className="text-gray-500 mt-2">빠르고 정확한 자기소개서 수정.</p>
          </div>
          <div className="text-center">
            <img
              src="/feedback.jpg"
              alt="Feature 2"
              className="w-48 h-48 object-cover mx-auto rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-4">사용자 맞춤 피드백</h3>
            <p className="text-gray-500 mt-2">개인화된 피드백 제공.</p>
          </div>
          <div className="text-center">
            <img
              src="/thumbs-up.jpg"
              alt="Feature 3"
              className="w-48 h-48 object-cover mx-auto rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-4">간편한 사용</h3>
            <p className="text-gray-500 mt-2">간단한 업로드로 빠르게 시작.</p>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          {currentUser ? (
            <Link
              to="/chat"
              className="bg-teal-500 text-white py-3 px-8 rounded-lg font-bold hover:bg-teal-600 transition"
            >
              지금 시작하기
            </Link>
          ) : (
            <Link
              to="/sign-up"
              className="bg-teal-500 text-white py-3 px-8 rounded-lg font-bold hover:bg-teal-600 transition"
            >
              지금 시작하기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
