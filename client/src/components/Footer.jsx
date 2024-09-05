import { Link } from 'react-router-dom';
import { Footer } from 'flowbite-react';
export default function FooterComponents() {
  return (
    <Footer container className="border border-t-4 border-blue-400">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r  from-indigo-500 rounded-lg via-purple-500 to-Blue-500 text-white">
                루크의
              </span>
              자기소개소
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-4">
            <div>
              <Footer.Title title="About Me" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/KAPUIST" target="_blank">
                  Github
                </Footer.Link>
                <Footer.Link
                  href="https://velog.io/@kapuistt/posts"
                  target="_blank"
                >
                  Velog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
}
