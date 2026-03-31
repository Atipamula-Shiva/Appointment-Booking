import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useSnackbar from "../common/Snackbar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const userName = user?.name || "User";
    logout();
    showSnackbar(`${userName} logged out successfully`, "success", 3000);
    navigate("/login");
  };

  const getUserInitial = () => {
    const name = user?.name || user?.username || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "64px",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "28px",
            fontWeight: "800",
            letterSpacing: "1px",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <span style={{ color: "#667eea" }}>SPOT</span>
          <span style={{ color: "#ffd166" }}>LO</span>
        </div>

        {/* Desktop Tagline */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "14px",
            fontStyle: "italic",
            fontWeight: "500",
            color: "#64748b",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>✨</span>
          <span>No waiting, just booking</span>
          <span>✨</span>
        </div>

        {/* Desktop Right Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {user && (
            <>
              {/* User Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "6px 16px 6px 12px",
                  background: "#f8fafc",
                  borderRadius: "40px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {user.role === "owner" ? "🏪" : getUserInitial()}
                </div>

                {/* User Details */}
                <div style={{ lineHeight: "1.3" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    {user.name || user.username || 'User'}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "2px",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: user.role === "owner" ? "#f59e0b" : "#10b981",
                        display: "inline-block",
                      }}
                    />
                    {user.role === "owner" ? "Shop Owner" : "Customer"}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 20px",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  transition: "opacity 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        {user && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span
              style={{
                fontSize: "20px",
                color: "#64748b",
              }}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && user && (
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            background: "white",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            zIndex: 99,
          }}
        >
          {/* Mobile User Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "600",
                color: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {user.role === "owner" ? "🏪" : getUserInitial()}
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: user.role === "owner" ? "#f59e0b" : "#10b981",
                    display: "inline-block",
                  }}
                />
                {user.role === "owner" ? "Shop Owner" : "Customer"}
              </div>
            </div>
          </div>

          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px 20px",
              borderRadius: "40px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              transition: "opacity 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;