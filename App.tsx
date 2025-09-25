import React, { useEffect } from 'react';
import UserApp from './UserApp';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './hooks/useTheme';

const App: React.FC = () => {
  const getPathComponent = () => {
    const path = window.location.pathname;

    if (path.startsWith('/dashboard')) {
      return <Dashboard />;
    }
    if (path === '/admin') {
      return <Redirect to="/dashboard" />;
    }
    return (
      <ThemeProvider>
        <UserApp />
      </ThemeProvider>
    );
  };

  return getPathComponent();
};

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  useEffect(() => {
    window.location.pathname = to;
  }, [to]);
  return null;
};

export default App;