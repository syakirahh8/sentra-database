import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./login";
import Dashboard from "./dashboard";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil sesi login saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Pantau perubahan status auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {!session ? <Login /> : <Dashboard session={session} />}
    </div>
  );
}

export default App;