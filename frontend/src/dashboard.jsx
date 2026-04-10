import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

import greatImg from "./assets/mood_options_image/05-img.png";
import goodImg from "./assets/mood_options_image/04-img.png";
import okayImg from "./assets/mood_options_image/03-img.png";
import sadImg from "./assets/mood_options_image/02-img.png";
import stressImg from "./assets/mood_options_image/01-img.png";

import greatCal from "./assets/mood_calendar_image/great-img.png";
import goodCal from "./assets/mood_calendar_image/good-img.png";
import okayCal from "./assets/mood_calendar_image/okay-img.png";
import sadCal from "./assets/mood_calendar_image/sad-img.png";
import stressCal from "./assets/mood_calendar_image/stress-img.png";

function Dashboard({ session }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthlyMoods, setMonthlyMoods] = useState({});

  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const [viewingDate, setViewingDate] = useState(today.getDate());

  const moodOptions = [
    { name: "Great", image: greatImg, calendarImage: greatCal, color: "#E1F5FE", level: 5 },
    { name: "Good", image: goodImg, calendarImage: goodCal, color: "#E0F2F1", level: 4 },
    { name: "Okay", image: okayImg, calendarImage: okayCal, color: "#FFF8E1", level: 3 },
    { name: "Bad", image: sadImg, calendarImage: sadCal, color: "#FFF3E0", level: 2 },
    { name: "Awful", image: stressImg, calendarImage: stressCal, color: "#FFEBEE", level: 1 },
  ];

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      const { data, error } = await supabase
        .from("moods")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("created_at", startOfMonth.toISOString())
        .lte("created_at", endOfMonth.toISOString());

      if (error) throw error;

      const moodMap = {};
      data.forEach((item) => {
        const day = new Date(item.created_at).getDate();
        moodMap[day] = item;
      });

      setMonthlyMoods(moodMap);

      const existingData = moodMap[viewingDate];
      if (existingData) {
        setSelectedMood(moodOptions.find(m => m.level === existingData.mood_level));
        setJournalText(existingData.note);
      } else {
        setSelectedMood(null);
        setJournalText("");
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodData();
  }, [session.user.id, currentDate]);

  const handleDateClick = (day) => {
    if (!day) return;
    setViewingDate(day);
    const existingData = monthlyMoods[day];
    if (existingData) {
      setSelectedMood(moodOptions.find(m => m.level === existingData.mood_level));
      setJournalText(existingData.note);
    } else {
      setSelectedMood(null);
      setJournalText("");
    }
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    setViewingDate(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return alert("Pilih mood dulu!");

    try {
      const submissionDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), viewingDate);
      const { error } = await supabase.from("moods").insert([{
        user_id: session.user.id,
        mood_level: selectedMood.level,
        note: journalText,
        created_at: submissionDate.toISOString()
      }]);

      if (error) throw error;
      alert("Mood berhasil disimpan!");
      fetchMoodData();
    } catch (err) {
      alert(err.message);
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days = Array(firstDayIndex).fill(null);
    for (let i = 1; i <= lastDate; i++) days.push(i);
    return days;
  };

  const isReadOnly = !!monthlyMoods[viewingDate];
  const isFuture = new Date(currentDate.getFullYear(), currentDate.getMonth(), viewingDate) > today;

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center">Loading...</div>;

  return (
    <div className="container-fluid py-4" style={{ background: "#F4F7F6", minHeight: "100vh" }}>
      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-info">Sentra Mood</h2>
          <div className="d-flex gap-2">
            <div className="btn btn-light rounded-pill shadow-sm border px-4 py-2">
              Hi, {session.user.email.split('@')[0]}
            </div>
            <button className="btn btn-white text-danger rounded-pill shadow-sm border px-4" onClick={() => supabase.auth.signOut()}>
              Logout
            </button>
          </div>
        </div>

        <div className="row">
          {/* SISI KIRI: Form Input */}
          <div className="col-lg-5 mb-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  {viewingDate} {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                </h5>
                {isReadOnly && <span className="badge bg-success rounded-pill">Recorded</span>}
              </div>

              <form onSubmit={handleSubmit}>
                <label className="text-muted small mb-3">How are you feeling?</label>
                
                {/* Scroll Horizontal Container dengan ukuran lebih besar */}
                <div 
                  className="d-flex gap-3 pb-3 mb-4" 
                  style={{ 
                    overflowX: "auto", 
                    scrollbarWidth: "none", 
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch"
                  }}
                >
                  <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                  
                  {moodOptions.map((m) => {
                    const isSelected = selectedMood?.level === m.level;
                    return (
                      <div
                        key={m.name}
                        onClick={() => !isReadOnly && !isFuture && setSelectedMood(m)}
                        style={{
                          padding: "0",
                          borderRadius: "12px",
                          textAlign: "center",
                          minWidth: "150px", // Ukuran diperbesar dari 122px ke 150px
                          height: "95px",   // Ukuran diperbesar dari 76px ke 95px
                          flexShrink: 0,
                          cursor: (isReadOnly || isFuture) ? "default" : "pointer",
                          backgroundColor: isSelected ? m.color : "#fff",
                          border: isSelected ? "3px solid #26C6DA" : "1px solid #eee",
                          opacity: (isReadOnly || isFuture) && !isSelected ? 0.3 : 1,
                          transition: "0.3s",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <img
                          src={m.image}
                          alt={m.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <label className="text-muted small mb-2">Journal</label>
                <textarea
                  className="form-control mb-4 border-0"
                  rows="5"
                  style={{ background: "#F1F3F4", borderRadius: "15px", padding: "15px" }}
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  readOnly={isReadOnly || isFuture}
                  placeholder={isFuture ? "The future is still a mystery..." : "Write your story here..."}
                ></textarea>

                {!isReadOnly && !isFuture && (
                  <button type="submit" className="btn btn-info w-100 py-3 text-white fw-bold shadow-sm" style={{ borderRadius: "12px" }}>
                    Submit Mood
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* SISI KANAN: Kalender */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-sm btn-outline-info border-0" onClick={() => changeMonth(-1)}>❮</button>
                <h5 className="fw-bold mb-0">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h5>
                <button className="btn btn-sm btn-outline-info border-0" onClick={() => changeMonth(1)}>❯</button>
              </div>

              <div className="row text-center mb-2 fw-bold text-muted" style={{ fontSize: "0.8rem" }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="col">{d}</div>)}
              </div>

              <div className="row g-2">
                {getCalendarDays().map((day, i) => {
                  const dayMood = monthlyMoods[day];
                  const moodInfo = dayMood ? moodOptions.find(m => m.level === dayMood.mood_level) : null;
                  const isRealToday = day === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear();

                  return (
                    <div key={i} className="col" style={{ flex: "0 0 14.28%" }}>
                      <div
                        onClick={() => handleDateClick(day)}
                        style={{
                          paddingTop: "100%", position: "relative", borderRadius: "12px",
                          border: viewingDate === day ? "2px solid #26C6DA" : "1px solid #f0f0f0",
                          backgroundColor: isRealToday ? "#FFD600" : (day ? "#fff" : "transparent"),
                          cursor: day ? "pointer" : "default",
                          transition: "0.2s",
                          overflow: "hidden"
                        }}
                      >
                        {day && (
                          <>
                            <span style={{ position: "absolute", top: "8px", left: "10px", fontSize: "0.8rem", zIndex: 2 }}>
                              {day}
                            </span>

                            {moodInfo && (
                              <div style={{
                                position: "absolute",
                                bottom: "-5px",
                                right: "-5px",
                                width: "65px",
                                height: "65px",
                                zIndex: 1,
                                pointerEvents: "none"
                              }}>
                                <img src={moodInfo.calendarImage} alt="mood" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;