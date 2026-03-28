import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 

const ProtectedRoute = ({ children, allowedRoles = ['customer', 'owner'] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Convert role to match backend format if needed
  const userRole = user?.role === 'SHOP_OWNER' ? 'owner' : user?.role?.toLowerCase();
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

// Add this if you want the spin animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ProtectedRoute;