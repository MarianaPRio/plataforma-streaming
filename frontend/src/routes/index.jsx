import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from '../contexts/AuthContext';
import PublicRoutes from './publicRoutes';
import PrivateRoutes from './privateRoutes';

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/app/*" element={<PrivateRoutes />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppRoutes;
