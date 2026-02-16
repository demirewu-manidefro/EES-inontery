import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Materials from './pages/Materials';
import Login from './pages/Login';
import Register from './pages/Register';
import Borrow from './pages/Borrow';
import Return from './pages/Return';
import WaitingReturn from './pages/WaitingReturn';
import LeaveOut from './pages/LeaveOut';
import AdminApprovals from './pages/AdminApprovals';
import Users from './pages/Users';
import LandingPage from './pages/LandingPage';
import News from './pages/News';
import Gallery from './pages/Gallery';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );
    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? <Navigate to="/dashboard" /> : children;
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/events" element={<News />} />
                    <Route path="/photo-gallery" element={<Gallery />} />
                    <Route path="/video-gallery" element={<Gallery />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
                    <Route path="/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
                    <Route path="/borrow" element={<PrivateRoute><Borrow /></PrivateRoute>} />
                    <Route path="/return" element={<PrivateRoute><Return /></PrivateRoute>} />
                    <Route path="/waiting" element={<PrivateRoute><WaitingReturn /></PrivateRoute>} />
                    <Route path="/leave-out" element={<PrivateRoute><LeaveOut /></PrivateRoute>} />
                    <Route path="/admin-approvals" element={<PrivateRoute><AdminApprovals /></PrivateRoute>} />
                    <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
