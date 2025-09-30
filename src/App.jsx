import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
// import Session from './pages/Session.jsx';
import Logout from './pages/Logout.jsx';
import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        {/* <Route path="/session" element={<Session />}/> */}
        <Route path="/logout" element={<Logout />}/>
      </Routes>
    </Router>
  );
}

export default App;