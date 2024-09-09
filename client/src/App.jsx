import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
