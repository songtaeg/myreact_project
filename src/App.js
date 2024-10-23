import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Join from './component/Join';
import Login from './component/Login';
import Main from './component/Main';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/main" element={<Main />} />
        </Routes>
    </Router>
  );
}

export default App;
