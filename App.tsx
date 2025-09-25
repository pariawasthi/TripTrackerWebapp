import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserApp from './UserApp';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './hooks/useTheme';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        {/* Home / User App wrapped with ThemeProvider */}
        <Route
          path="/"
          element={
            <ThemeProvider>
              <UserApp />
            </ThemeProvider>
          }
        />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin route redirects to dashboard */}
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all route: redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
