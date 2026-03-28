// ============================================
// FILE: src/App.js
// ============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { SnackbarProvider } from './common/Snackbar';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // 👈 Make sure this is imported
import Home from './pages/Home';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes - No authentication required */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> {/* 👈 Register is public */}
            
            {/* Protected Routes - Require authentication */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'owner']}>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/:shopName" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'owner']}>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;