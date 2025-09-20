import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard setUser={setUser} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={!user ? <Home /> : <Navigate to="/dashboard" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
