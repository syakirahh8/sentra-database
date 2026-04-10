import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Login() {
  // 1. Tambahkan state untuk menentukan sedang di mode Login atau Register
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        // --- LOGIKA REGISTER ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Pendaftaran berhasil! Silakan cek email kamu untuk konfirmasi.");
      } else {
        // --- LOGIKA LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert("Login berhasil!");
      }
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "350px", borderRadius: "15px" }}>
        {/* 2. Judul berubah sesuai mode */}
        <h3 className="text-center mb-4 fw-bold">
          {isRegistering ? "Create Account" : "Log in To Start"}
        </h3>

        <form onSubmit={handleAuth}>
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

          {/* 3. Teks tombol berubah sesuai mode */}
          <button type="submit" className="btn btn-light w-100 border py-2" disabled={loading}>
            {loading ? "Processing..." : (isRegistering ? "Register" : "Sign In")}
          </button>
        </form>

        {/* 4. Link di bawah ini sekarang punya fungsi onClick untuk ganti mode */}
        <p className="text-center mt-3 text-muted" style={{ fontSize: "0.8rem" }}>
          {isRegistering ? "Already have an account?" : "Not yet have an account?"}{" "}
          <span 
            className="text-info" 
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;