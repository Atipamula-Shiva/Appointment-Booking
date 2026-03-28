import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import useSnackbar from "../common/Snackbar";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "customer"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      showSnackbar("Passwords don't match", "error", 3000);
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      showSnackbar("Password must be at least 6 characters", "error", 3000);
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Send exactly what API expects
    const result = await register({
      username: formData.username,     // ✅ username
      password: formData.password,     // ✅ password
      name: formData.name,             // ✅ name
      role: formData.role              // ✅ role (will be converted to CUSTOMER or SHOP_OWNER in authService)
    });
    
    if (result.success) {
      showSnackbar(`Welcome ${formData.name}! Account created successfully`, "success", 3000);
      // Redirect based on role
      if (formData.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error);
      showSnackbar(result.error || "Registration failed", "error", 4000);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      {/* LEFT SIDE (Desktop Only) */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div style={{ maxWidth: "400px" }}>
            <div style={{ fontSize: "34px", fontWeight: "800" }}>
              <span>SPOT</span>
              <span style={{ color: "#ffd166" }}>LO</span>
            </div>

            <p
              style={{
                marginTop: "12px",
                fontSize: "16px",
                fontStyle: "italic",
                opacity: 0.9,
              }}
            >
              Join the waiting-free experience
            </p>

            <div style={{ marginTop: "40px", lineHeight: "1.6" }}>
              <p>✓ Book appointments instantly</p>
              <p>✓ Skip long waiting queues</p>
              <p>✓ Manage shops easily</p>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "20px" : "40px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: isMobile ? "20px" : "28px",
            padding: isMobile ? "24px" : "36px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          {/* Mobile Logo */}
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "26px", fontWeight: "800" }}>
                <span style={{ color: "#667eea" }}>SPOT</span>
                <span style={{ color: "#764ba2" }}>LO</span>
              </span>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontStyle: "italic",
                }}
              >
                No waiting, just booking
              </div>
            </div>
          )}

          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Join SPOTLO today
          </p>

          {/* Role Tabs */}
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: "30px",
              padding: "4px",
              marginBottom: "20px",
            }}
          >
            {["customer", "owner"].map((r) => (
              <button
                key={r}
                onClick={() => setFormData({...formData, role: r})}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "30px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: formData.role === r ? "white" : "transparent",
                  color: formData.role === r ? "#667eea" : "#475569",
                  transition: "all 0.2s ease",
                }}
              >
                {r === "customer" ? "👤 Customer" : "🏪 Owner"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  padding: "10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              >
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={inputStyle}
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={inputStyle}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={inputStyle}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={inputStyle}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "25px",
                fontWeight: "600",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s ease",
};

export default RegisterPage;