import { useSelector } from 'react-redux';
export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

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
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            회원탈퇴
          </a>
        </div>
      </div>
    </div>
  );
}
