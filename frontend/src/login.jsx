import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Login() {
  // State untuk switch antara tampilan Login dan Register
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        // --- LOGIKA REGISTER DENGAN REDIRECT ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // URL ini harus sama dengan yang kamu daftarkan di Supabase Dashboard
            emailRedirectTo: 'https://fiorekinan.github.io/sentra-verified/',
          },
        });
        if (error) throw error;
        alert("Pendaftaran berhasil! Cek email kamu (termasuk spam) untuk konfirmasi akun.");
      } else {
        // --- LOGIKA LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert("Login Berhasil!");
      }
    } catch (error) {
      alert("Waduh, ada masalah: " + error.message);
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
            {loading ? "Sabar ya..." : (isRegistering ? "Register Now" : "Sign In")}
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
              {isRegistering ? "Login Disini" : "Daftar Akun"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;