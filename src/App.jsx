import React, { useState, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import ProtectedRoute from './hooks/ProtectedRoutes.jsx';
import usePageLoad from './hooks/usePageLoad.js';
import Loading from './components/Loading';

const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Settings = lazy(() => import('./pages/Settings'));
const Sales = lazy(() => import('./pages/Sales'));
const StockIn = lazy(() => import('./pages/StockIn'));
const Reports = lazy(() => import('./pages/Reports'));
const Reciepts = lazy(() => import('./pages/Reciepts'));

const RouteWrapper = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const isLoading = usePageLoad();
  const location = useLocation();

  useEffect(() => {
    setInitialLoading(true);
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (initialLoading || isLoading) ? <Loading /> : children;
};

const App = () => {
  return (
    <>
      <Toaster position='top-right' closeButton richColors/>
      <Router>
        <Routes>
          <Route path="/login" element={<RouteWrapper><Login /></RouteWrapper>} />
          <Route path="/404" element={<RouteWrapper><NotFound /></RouteWrapper>} />
          {/* <Route path="*" element={<Navigate to="/404" />} /> */}
          {/* Protected routes (require login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<RouteWrapper><Dashboard /></RouteWrapper>} />
            <Route path="/inventory" element={<RouteWrapper><Inventory /></RouteWrapper>} />
            <Route path="/settings" element={<RouteWrapper><Settings /></RouteWrapper>} />
            <Route path="/sales" element={<RouteWrapper><Sales /></RouteWrapper>} />
            <Route path="/stockin" element={<RouteWrapper><StockIn /></RouteWrapper>} />
            <Route path="/reports" element={<RouteWrapper><Reports /></RouteWrapper>} />
            <Route path="/reciepts" element={<RouteWrapper><Reciepts /></RouteWrapper>} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
