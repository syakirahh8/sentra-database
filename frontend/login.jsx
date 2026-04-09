import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Cek ke backend Node.js kamu
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal login');
      }

      // 2. Set session di Supabase frontend agar user terekam masuk
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      alert("Login Berhasil!");
      // window.location.reload() akan memicu App.jsx untuk render Dashboard
      window.location.reload(); 

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form className="form-wrapper" onSubmit={handleLogin}>
            <h2 className="title">Log in To Start</h2>

            {/* Email */}
            <label>Email</label>
            <div className="input-box">
              <i className="fa-regular fa-envelope"></i>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <label>Password</label>
            <div className="input-box">
              <i className="fa-solid fa-lock"></i>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-end mb-4">
              <a href="#" className="text-decoration-none" style={{fontSize: '14px', color: '#6c757d'}}>Forgot Password?</a>
            </div>

            <button type="submit" className="btn-register w-100 border-0" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <p className="login-text mt-5 text-center">
              Not yet have an account?{' '}
              <button type="button" onClick={() => setView('register')} className="login-link border-0 bg-transparent p-0">
                Register
              </button>
            </p>
          </form>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 p-0 d-none d-md-block">
          {/* Pastikan Frame.png ada di folder 'public' */}
          <img src="/Frame.png" className="right-img w-100 h-100" style={{objectFit: 'cover'}} alt="Login Frame" />
        </div>
      </div>
    </div>
  );
}