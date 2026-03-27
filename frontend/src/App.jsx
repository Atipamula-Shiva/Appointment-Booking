// ============================================
// FILE: src/App.js
// ============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage';

// Import your existing Home and BookingPage components here
// (Keep your existing Home.js and BookingPage.js as they are)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
    </AuthProvider>
  );
}

export default App;