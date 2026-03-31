// ============================================
// FILE: src/App.js
// ============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './common/Snackbar';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { publicRoutes, allProtectedRoutes } from './routes';

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes - No authentication required */}
            {publicRoutes.map(({ path, element: Element }) => (
              <Route key={path} path={path} element={<Element />} />
            ))}

            {/* Protected Routes - Require authentication (both customer and shop owner) */}
            {allProtectedRoutes.map(({ path, element: Element, allowedRoles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    <Element />
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Optional: 404 fallback */}
            <Route path="*" element={<div style={{ textAlign: 'center', padding: '2rem' }}>Page not found</div>} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;