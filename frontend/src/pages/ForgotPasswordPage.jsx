import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useSnackbar from "../common/Snackbar";
import api from "./api";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState(1); // 1: email form, 2: OTP + password form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/password/forgot-password", { email });
      
      if (response.data) {
        showSnackbar("OTP sent to your email", "success", 3000);
        setStep(2);
      } else {
        setError("Failed to send OTP");
        showSnackbar("Failed to send OTP", "error", 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Error sending OTP";
      setError(errorMessage);
      showSnackbar(errorMessage, "error", 3000);
    }
    setLoading(false);
  };

  // Step 2: Reset password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      showSnackbar("Passwords do not match", "error", 3000);
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      showSnackbar("Password must be at least 6 characters", "error", 3000);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/password/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });

      if (response.data) {
        showSnackbar("Password reset successfully! Redirecting to login...", "success", 3000);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("Failed to reset password");
        showSnackbar("Failed to reset password", "error", 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Error resetting password";
      setError(errorMessage);
      showSnackbar(errorMessage, "error", 3000);
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
              No waiting, just booking
            </p>

            <div style={{ marginTop: "40px", lineHeight: "1.6" }}>
              <p>✓ Reset your password safely</p>
              <p>✓ Get back to booking</p>
              <p>✓ Secure verification via OTP</p>
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
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>

          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {step === 1
              ? "Enter your email to receive an OTP"
              : "Enter the OTP and your new password"}
          </p>

          {/* STEP 1: Email Form */}
          {step === 1 && (
            <form
              onSubmit={handleSendOtp}
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
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP + Password Form */}
          {step === 2 && (
            <form
              onSubmit={handleResetPassword}
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
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={inputStyle}
                required
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                style={{
                  background: "transparent",
                  color: "#667eea",
                  border: "1px solid #667eea",
                  padding: "12px",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Back
              </button>
            </form>
          )}

          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Remember your password?{" "}
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
              Back to Login
            </Link>
            {' | '}
            <Link
              to="/forgot-username"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Forgot Username
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

export default ForgotPasswordPage;
