import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/auth/PrivateRoute';
import PublicRoute from './components/auth/PublicRoute';
import InstallPrompt from './components/pwa/InstallPrompt';
import OfflineIndicator from './components/pwa/OfflineIndicator';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import LectureDetail from './pages/LectureDetail';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout>
                    <InstallPrompt />
                    <OfflineIndicator />
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/lecture/:id"
                            element={
                                <PrivateRoute>
                                    <LectureDetail />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </AppLayout>
            </Router>
        </AuthProvider>
    );
}

export default App;
