import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home.jsx';
import Quiz from './components/Quiz.jsx';
import Result from './components/Result.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import './styles/main.css';

export default function App() {
  const [user, setUser] = useState({ name: '', instaId: '' });
  const [scoreData, setScoreData] = useState(null);

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          
          <Route path="/quiz" element={
            user.name && user.instaId ? 
            <Quiz user={user} setScoreData={setScoreData} /> : 
            <Navigate to="/" />
          } />
          
          <Route path="/result" element={
            scoreData ? <Result scoreData={scoreData} /> : <Navigate to="/" />
          } />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}