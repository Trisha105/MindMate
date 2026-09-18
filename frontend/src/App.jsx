import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './dashboard/Dashboard';
import Journal from './journal/Journal';
import MoodTracker from './mood/MoodTracker';
import Chatbot from './chatbot/Chatbot';
import Settings from './settings/Settings';
import Support from './components/Support';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/journal" element={
            <PrivateRoute>
              <Journal />
            </PrivateRoute>
          } />
          <Route path="/mood" element={
            <PrivateRoute>
              <MoodTracker />
            </PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          <Route path="/support" element={
            <PrivateRoute>
              <Support />
            </PrivateRoute>
          } />
        </Routes>
      </Layout>
      <Toast />
    </Router>
  );
}

export default App;
