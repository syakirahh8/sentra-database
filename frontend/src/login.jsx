import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import Swal from "sweetalert2";
import successIcon from "./assets/success-image.png";
import errorIcon from "./assets/error-image.png";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://fiorekinan.github.io/sentra-verified/',
          },
        });
        if (error) throw error;

        Swal.fire({
          title: "Registration successful!",
          text: "Please check your email for account confirmation",
          imageUrl: successIcon,
          imageWidth: 150,
          imageHeight: 150,
          confirmButtonColor: "#26C6DA",
        });

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        Swal.fire({
          title: "Welcome Back!",
          text: "You have successfully logged in!",
          imageUrl: successIcon,
          imageWidth: 150,
          imageHeight: 150,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Sorry..",
        text: error.message,
        imageUrl: errorIcon,
        imageWidth: 150,
        imageHeight: 150,
        confirmButtonColor: "#f27474",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "400px", borderRadius: "20px", border: "none" }}>
        <h3 className="text-center mb-4 fw-bold">
          {isRegistering ? "Create Account" : "Log in To Start"}
        </h3>

        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <label className="form-label text-muted small">Email Address</label>
            <input
              type="email"
              className="form-control border-0 shadow-sm"
              style={{ background: "#F1F3F4", borderRadius: "10px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-muted small">Password</label>
            <input
              type="password"
              className="form-control border-0 shadow-sm"
              style={{ background: "#F1F3F4", borderRadius: "10px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          <button type="submit" className="btn btn-info w-100 py-3 text-white fw-bold shadow-sm" style={{ borderRadius: "12px" }} disabled={loading}>
            {loading ? "Loading.." : (isRegistering ? "Register Now" : "Sign In")}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted small">
            {isRegistering ? "Already have an account?" : "Not yet have an account?"}{" "}
            <span
              className="text-info fw-bold"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;