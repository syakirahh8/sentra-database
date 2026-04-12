import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import "./style.css";

// Assets
import successIcon from "./assets/success-image.png";
import errorIcon from "./assets/error-image.png";
import authBanner from "./assets/auth.svg";

function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      return Swal.fire({
        title: "Oops!",
        text: "Passwords do not match!",
        icon: "warning",
        confirmButtonColor: "#26C6DA",
      });
    }

    setLoading(true);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Swal.fire({
          title: "Registration successful!",
          text: "Please check your email",
          imageUrl: successIcon,
          imageWidth: 150,
          confirmButtonColor: "#26C6DA",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data.session) {
          navigate("/dashboard"); 
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        imageUrl: errorIcon,
        imageWidth: 150,
        confirmButtonColor: "#f27474",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">

        <div className="col-md-6 d-flex align-items-center justify-content-center p-5">
          <div style={{ maxWidth: "380px", width: "100%" }}>
            <h2 className="fw-bold mb-4">{isRegistering ? "Create Account" : "Login to Start"}</h2>
            <form onSubmit={handleAuth}>
              <div className="input-group-custom mb-4">
                <label className="custom-label">Email</label>
                <div className="input-wrapper">
                  <i className="fa-regular fa-envelope icon-field"></i>
                  <input
                    type="email"
                    className="custom-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="input-group-custom mb-4">
                <label className="custom-label">Password</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-lock icon-field"></i>
                  <input
                    type="password"
                    className="custom-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {isRegistering && (
                <div className="input-group-custom mb-4">
                  <label className="custom-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <i className="fa-solid fa-circle-check icon-field"></i>
                    <input
                      type="password"
                      className="custom-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? "Processing..." : isRegistering ? "Sign Up" : "Log In"}
              </button>
            </form>
            <p className="mt-4 text-center small">
              {isRegistering ? "Already have an account?" : "Do not have an account?"}{" "}
              <span
                className="text-info fw-bold"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? "Log In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
        <div className="col-md-6 d-none d-md-block banner-container">
          <img
            src={authBanner}
            alt="Banner"
            className="banner-img"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;