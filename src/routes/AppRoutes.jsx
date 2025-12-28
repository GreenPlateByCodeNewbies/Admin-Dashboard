import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Stalls from '../pages/Stalls/Stalls';
import Domains from '../pages/Domains/Domains';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/stalls" 
        element={
          <ProtectedRoute>
            <Stalls />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/domains" 
        element={
          <ProtectedRoute>
            <Domains />
          </ProtectedRoute>
        } 
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;