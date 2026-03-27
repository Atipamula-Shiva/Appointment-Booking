import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        height: "60px",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Center Tagline */}
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
          pointerEvents: "none",
        }}
      >
        No waiting, just booking
      </div>

      <div
        style={{
          width: "100%",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo Text */}
        <div
          onClick={() => navigate("/")}
          onMouseEnter={() => setHoverLogo(true)}
          onMouseLeave={() => setHoverLogo(false)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "25px",
            fontWeight: "800",
            letterSpacing: "1px",
            opacity: hoverLogo ? 0.8 : 1,
            transition: "0.2s",
          }}
        >
          <span style={{ color: "#667eea" }}>SPOT</span>
          <span style={{ color: "#ffd166" }}>LO</span>
        </div>

        {/* Right Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {user && (
            <>
              {/* User Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 10px",
                  background: "#f8fafc",
                  borderRadius: "25px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  {user.role === "owner" ? "🏪" : "👤"}
                </div>

                <div style={{ lineHeight: "1.1" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                    }}
                  >
                    {user.role === "owner" ? "Owner" : "Customer"}
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                onMouseEnter={() => setHoverLogout(true)}
                onMouseLeave={() => setHoverLogout(false)}
                style={{
                  border: "1px solid #e2e8f0",
                  padding: "5px 12px",
                  borderRadius: "18px",
                  fontSize: "12px",
                  cursor: "pointer",
                  background: hoverLogout ? "#f1f5f9" : "transparent",
                  color: "#64748b",
                  transition: "0.2s",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;