import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Join from './component/Join';
import Login from './component/Login';
import Main from './component/Main';
import Add from './component/Add';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/main" element={<Main />} />
          <Route path="/add" element={<Add />} />
        </Routes>
    </Router>
  );
}

export default App;
