import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useSnackbar from "../common/Snackbar";
import api from "./api";

const ForgotUsernamePage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState(1); // 1: email, 2: otp verify
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/password/forgot-username", { email });
      if (response.data) {
        showSnackbar("OTP sent to your email", "success", 3000);
        setStep(2);
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Error sending OTP";
      setError(errorMessage);
      showSnackbar(errorMessage, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/password/forgot-username/verify", {
        email,
        otp,
      });

      setUsername(response.data?.username || "");

      showSnackbar("Username recovered. Redirecting to login...", "success", 3000);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Invalid OTP";
      setError(errorMessage);
      showSnackbar(errorMessage, "error", 3000);
    } finally {
      setLoading(false);
    }
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
            <p style={{ marginTop: "12px", fontSize: "16px", fontStyle: "italic", opacity: 0.9 }}>
              No waiting, just booking
            </p>
            <div style={{ marginTop: "40px", lineHeight: "1.6" }}>
              <p>✓ Recover username safely</p>
              <p>✓ OTP-based verification</p>
              <p>✓ Quick login restore</p>
            </div>
          </div>
        </div>
      )}

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
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "26px", fontWeight: "800" }}>
                <span style={{ color: "#667eea" }}>SPOT</span>
                <span style={{ color: "#764ba2" }}>LO</span>
              </span>
              <div style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                No waiting, just booking
              </div>
            </div>
          )}

          <h1 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "6px" }}>
            {step === 1 ? "Forgot Username" : "Enter OTP"}
          </h1>

          <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", marginBottom: "20px" }}>
            {step === 1
              ? "Enter your email and we will send an OTP to recover your username"
              : "Enter the OTP sent to your email"}
          </p>

          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "10px", fontSize: "12px", marginBottom: "12px" }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                }}
                style={secondaryButtonStyle}
              >
                Back
              </button>
            </form>
          )}

          {username && (
            <div style={{ marginTop: "16px", fontSize: "14px", color: "#0f172a", textAlign: "center" }}>
              Your username is: <strong>{username}</strong>
            </div>
          )}

          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#64748b" }}>
            Already remember your account?{' '}
            <Link to="/login" style={{ color: "#667eea", fontWeight: "600", textDecoration: "none" }}>
              Back to Login
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

const buttonStyle = (loading) => ({
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "25px",
  fontWeight: "600",
  cursor: "pointer",
  opacity: loading ? 0.7 : 1,
  transition: "opacity 0.2s ease",
});

const secondaryButtonStyle = {
  background: "transparent",
  color: "#667eea",
  border: "1px solid #667eea",
  padding: "12px",
  borderRadius: "25px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export default ForgotUsernamePage;
