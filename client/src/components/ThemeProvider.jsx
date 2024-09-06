import { useSelector } from 'react-redux';
export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-600 dark:text-gray-200 dark:bg-[rgba(13,16,25,0.88)]">
        {children}
      </div>
    </div>
  );
}
