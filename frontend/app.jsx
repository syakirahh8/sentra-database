import React, { useState, useEffect } from 'react';
import './App.css'; 
import { supabase } from './supabaseClient';

// Import Komponen yang baru kita buat
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' atau 'register'

  useEffect(() => {
    // Cek status login saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listener jika user tiba-tiba login / logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  // Jika belum login, tampilkan layar Auth
  if (!session) {
    return authView === 'login' ? 
      <Login setView={setAuthView} /> : 
      <Register setView={setAuthView} />;
  }

  // Jika sudah login, tampilkan Dashboard
  return <Dashboard session={session} />;
}

export default App;