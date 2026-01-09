import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import { User, Company } from './types';

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);

  const handleLogin = (user: User, company?: Company) => {
    setCurrentUser(user);
    if (company) {
      setCurrentCompany(company);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentCompany(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.role === 'super-admin') {
    return <SuperAdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentCompany) {
    return <CompanyDashboard user={currentUser} company={currentCompany} onLogout={handleLogout} />; 
  }

  return <LoginPage onLogin={handleLogin} />;
};

export default App;
