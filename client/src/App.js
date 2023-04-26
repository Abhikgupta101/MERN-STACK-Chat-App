import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from './pages/Chat';
import ForgotPassword from './pages/ForgotPassword';
import NewPassword from './pages/NewPassword';
import { useDispatch } from 'react-redux';
import { showSize } from './store/windowSlice';
import { useEffect } from 'react';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';

export default function App() {
  const userid = localStorage.getItem('userId')
  const dispatch = useDispatch();

  useEffect(() => {
    function handleWindowResize() {
      dispatch(showSize(getWindowSize().innerWidth));
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);


  return (
    <BrowserRouter>
      <Routes >
        < Route path='/' element={<Chat />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        < Route path='/password/reset' element={<ForgotPassword />} />
        < Route path='/password/reset/:id/:token' element={<NewPassword />} />
        < Route path='/*' element={<Navigate to="/signin" />} />
      </Routes >
    </BrowserRouter>
  );
}

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

