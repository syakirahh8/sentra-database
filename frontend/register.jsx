import React, { useState } from 'react';

export default function Register({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return alert("Password dan Confirm Password tidak cocok!");
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: "Sentra User" })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setView('login'); // Otomatis pindah ke halaman login setelah daftar
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (err) {
      alert("Error server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form className="form-wrapper" onSubmit={handleRegister}>
            <h2 className="title">Register To Start</h2>

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

            {/* Confirm */}
            <label>Confirm Password</label>
            <div className="input-box">
              <i className="fa-solid fa-circle-check"></i>
              <input
                type="password"
                placeholder="Enter your correct password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-register w-100 border-0" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="login-text mt-5 text-center">
              Already have an account?{' '}
              <button type="button" onClick={() => setView('login')} className="login-link border-0 bg-transparent p-0">
                Log in
              </button>
            </p>
          </form>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 p-0 d-none d-md-block">
          <img src="/Frame.png" className="right-img w-100 h-100" style={{objectFit: 'cover'}} alt="Register Frame" />
        </div>
      </div>
    </div>
  );
}