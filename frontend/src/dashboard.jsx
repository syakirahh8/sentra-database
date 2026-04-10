import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; 

function Dashboard({ session }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [today] = useState(new Date());

  // Logika Kalender
  const year = today.getFullYear();
  const month = today.getMonth();
  const startDay = new Date(year, month, 1).getDay(); 

  const getCalendarDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDay; i++) { days.push(null); }
    for (let i = 1; i <= daysInMonth; i++) { days.push(i); }
    return days;
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      alert("Pilih mood dulu ya!");
      return;
    }

    try {
      // Menyesuaikan dengan kolom: mood_level (int) dan note (text)
      const { error } = await supabase.from("moods").insert([{
        user_id: session.user.id,
        mood_level: selectedMood.level, // Mengirim angka ke mood_level
        note: journalText,              // Mengirim teks ke kolom note
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;
      alert("Data masuk! Semangat belajarnya!");
      setSelectedMood(null);
      setJournalText("");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const moodOptions = [
    { name: "Great", emoji: "😆", color: "#E1F5FE", level: 5 },
    { name: "Good", emoji: "🙂", color: "#E0F2F1", level: 4 },
    { name: "Okay", emoji: "😐", color: "#FFF8E1", level: 3 },
    { name: "Bad", emoji: "😞", color: "#FFF3E0", level: 2 },
    { name: "Awful", emoji: "😡", color: "#FFEBEE", level: 1 },
  ];

  return (
    <div className="container-fluid py-4" style={{ background: "#F4F7F6", minHeight: "100vh" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Sentra Mood</h2>
          <button className="btn btn-light rounded-pill border shadow-sm px-4" onClick={handleLogout}>
             Hi, {session.user.email.split('@')[0]} <span className="text-danger ms-2">Logout</span>
          </button>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              <form onSubmit={handleSubmit}>
                <label className="text-muted mb-3">What do you feel today?</label>
                <div className="d-flex justify-content-between mb-4">
                  {moodOptions.map((m) => (
                    <div 
                      key={m.name}
                      onClick={() => setSelectedMood(m)}
                      style={{
                        padding: "15px", borderRadius: "15px", textAlign: "center", cursor: "pointer", width: "100px",
                        backgroundColor: selectedMood?.level === m.level ? m.color : "#fff",
                        border: selectedMood?.level === m.level ? "2px solid #26C6DA" : "1px solid #eee"
                      }}
                    >
                      <small className="d-block text-muted">{m.name}</small>
                      <span style={{ fontSize: "2rem" }}>{m.emoji}</span>
                    </div>
                  ))}
                </div>

                <label className="text-muted mb-3">Wanna write something?</label>
                <textarea 
                  className="form-control mb-4 border-0" 
                  rows="5" 
                  style={{ background: "#F1F3F4", borderRadius: "15px", padding: "15px" }}
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Tulis ceritamu di sini..."
                ></textarea>

                <button type="submit" className="btn btn-info w-100 py-3 text-white fw-bold" style={{ borderRadius: "12px" }}>
                  Submit Mood
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              <h5 className="text-center fw-bold mb-4">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h5>
              <div className="row text-center mb-2 fw-bold text-muted" style={{ fontSize: "0.8rem" }}>
                {weekdays.map(d => <div key={d} className="col">{d}</div>)}
              </div>
              <div className="row g-1">
                {getCalendarDays().map((day, i) => (
                  <div key={i} className="col" style={{ flex: "0 0 14.28%" }}>
                    <div style={{
                      paddingTop: "100%", position: "relative", borderRadius: "8px", border: "1px solid #f8f8f8",
                      backgroundColor: day === today.getDate() ? "#FFD600" : (day ? "#fff" : "transparent")
                    }}>
                      {day && <span style={{ position: "absolute", top: "5px", left: "5px", fontSize: "0.7rem" }}>{day}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;