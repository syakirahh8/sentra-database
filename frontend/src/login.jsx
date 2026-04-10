import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      alert("Login berhasil!");
    } catch (error) {
      alert("Login gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "350px", borderRadius: "15px" }}>
        <h3 className="text-center mb-4 fw-bold">Log in To Start</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-muted">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-muted">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-light w-100 border py-2" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-3 text-muted" style={{ fontSize: "0.8rem" }}>
          Not yet have an account? <span className="text-info" style={{ cursor: "pointer" }}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;