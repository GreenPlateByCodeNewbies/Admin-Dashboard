// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';

// Placeholder pages (we'll build these next)
const Stalls = () => <div className="p-8"><h1 className="text-3xl font-bold">Stalls Page - Coming Soon</h1></div>;
const Domains = () => <div className="p-8"><h1 className="text-3xl font-bold">Domains Page - Coming Soon</h1></div>;

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