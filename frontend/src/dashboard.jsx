import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

// Assets
import sentraIcon from "./assets/Sentra Icon.svg";
import sentraUser from "./assets/user.svg";
import loadingImage from "./assets/Loading Image.svg";
import aiIcon from "./assets/ai-icon.svg";

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

import errorImg from "./assets/error-image.png"
import successImg from "./assets/success-image.png"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard({ session }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showLogout, setShowLogout] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthlyMoods, setMonthlyMoods] = useState({});

  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const [viewingDate, setViewingDate] = useState(today.getDate());

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const moodOptions = [
    { name: "Great", image: greatImg, calendarImage: greatCal, color: "#04C4D9", level: 5 },
    { name: "Good", image: goodImg, calendarImage: goodCal, color: "#00A384", level: 4 },
    { name: "Okay", image: okayImg, calendarImage: okayCal, color: "#FE6B03", level: 3 },
    { name: "Sad", image: sadImg, calendarImage: sadCal, color: "#FCC21B", level: 2 },
    { name: "Stress", image: stressImg, calendarImage: stressCal, color: "#F2624E", level: 1 },
  ];

  const moodValues = Object.values(monthlyMoods);
  const moodCounts = moodOptions.map(option =>
    moodValues.filter(m => m.mood_level === option.level).length
  );

  const pieData = {
    labels: moodOptions.map(m => m.name),
    datasets: [
      {
        label: 'Mood Count',
        data: moodCounts,
        backgroundColor: ['#04C4D9', '#00A384', '#FE6B03', '#FCC21B', '#F2624E'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  const isChartReady = !loading;

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    if (!selectedMood) {
      return Swal.fire({
        title: 'Oops',
        text: 'Please select a mood before submitting..',
        imageUrl: errorImg,
        imageWidth: 140,
        imageHeight: 140,
        imageAlt: 'Warning Image',
        confirmButtonColor: '#04C4D9',
      });
    }

    try {
      const submissionDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), viewingDate);
      const { error } = await supabase.from("moods").insert([{
        user_id: session.user.id,
        mood_level: selectedMood.level,
        note: journalText,
        created_at: submissionDate.toISOString()
      }]);

      if (error) throw error;

      Swal.fire({
        title: 'Mood Saved',
        imageUrl: successImg,
        imageWidth: 140,
        imageHeight: 140,
        confirmButtonColor: '#04C4D9',
      });

      fetchMoodData();
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message,
        imageUrl: errorImg,
        confirmButtonColor: '#F2624E',
      });
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

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center loading"><img src={loadingImage} alt="Loading..." /></div>;

  return (
    <div className="dashboard">
      <div className="container-fluid py-4 dashboard-container">
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <img src={sentraIcon} alt="Logo" className="logo-icon" />
            <div className="profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
              <div className="profile-trigger d-flex align-items-center gap-2" onClick={() => setShowLogout(!showLogout)} style={{ cursor: 'pointer' }}>
                <div className="py-2 px-2">Hi, {session.user.email.split('@')[0]}</div>
                <div className="profile-icon"><img src={sentraUser} alt="Profile" className="logo-icon" /></div>
              </div>
              {showLogout && (
                <div className="logout-menu border" style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: 'white', zIndex: 10, borderRadius: '8px', padding: '10px' }}>
                  <button className="btn btn-link text-danger text-decoration-none p-0" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            {/* Mood Form */}
            <div className="col-lg-5 mb-4">
              <div className="custom-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">{viewingDate} {currentDate.toLocaleDateString('en-US', { month: 'long' })}</h5>
                  {isReadOnly && <span className="badge badge-custom p-2">Recorded</span>}
                </div>
                <form onSubmit={handleSubmit}>
                  <label className="text-muted mb-3">How are you feeling?</label>
                  <div className="mood-scroll-wrapper">
                    {moodOptions.map((m) => {
                      const isSelected = selectedMood?.level === m.level;
                      const isDisabled = isReadOnly || isFuture;
                      return (
                        <div key={m.name} onClick={() => !isDisabled && setSelectedMood(m)} className={`mood-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`} style={{ backgroundColor: isSelected ? m.color : "#fff" }}>
                          <img src={m.image} alt={m.name} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="divider-dashed"></div>
                  <label className="text-muted small mb-2">Journal</label>
                  <textarea className="form-control mb-4 journal-textarea" rows="5" value={journalText} onChange={(e) => setJournalText(e.target.value)} readOnly={isReadOnly || isFuture} placeholder={isFuture ? "The future is still a mystery..." : "Write your story here..."}></textarea>
                  <button type="submit" className="btn btn-info w-100 py-3 text-white fw-bold shadow-sm btn-submit-mood" disabled={isReadOnly || isFuture}>{isReadOnly ? "Mood Recorded" : "Submit Mood"}</button>
                </form>
              </div>
            </div>

            {/* Calendar */}
            <div className="col-lg-7">
              <div className="custom-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <button className="btn btn-sm btn-outline-info border-0" onClick={() => changeMonth(-1)}>❮</button>
                  <h5 className="fw-bold mb-0">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h5>
                  <button className="btn btn-sm btn-outline-info border-0" onClick={() => changeMonth(1)}>❯</button>
                </div>
                <div className="row text-center mb-2 fw-bold text-muted" style={{ fontSize: "0.8rem" }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="col">{d}</div>)}
                </div>
                <div className="row g-2">
                  {getCalendarDays().map((day, i) => {
                    const dayMood = monthlyMoods[day];
                    const moodInfo = dayMood ? moodOptions.find(m => m.level === dayMood.mood_level) : null;
                    const isRealToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                    return (
                      <div key={i} className="calendar-grid-col">
                        <div onClick={() => day && handleDateClick(day)} className={`calendar-day-cell ${day ? 'active' : ''} ${viewingDate === day ? 'selected-date' : ''} ${isRealToday ? 'is-today' : ''}`}>
                          {day && (
                            <>
                              <span className="day-number">{day}</span>
                              {moodInfo && <div className="mood-overlay-img"><img src={moodInfo.calendarImage} alt="mood" /></div>}
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

          <div className="divider-dashed mt-5"></div>

          {/* Chart & AI Section */}
          <section className="mood-summary-section">
            <div className="main-combined-card">
              <div className="combined-header">
                <h5 className="main-panel-title">Mood Chart</h5>
                <a href="#" className="report-link">Report</a>
              </div>
              <div className="combined-content-wrapper">
                <div className="chart-grey-box">
                  <div className="chart-inner-header">
                    <div className="filter-dropdown">Last 30 Days</div>
                  </div>
                  <div className="pie-render-area">
                    <div className="pie-size-fix" style={{ height: '300px', position: 'relative' }}>
                      {isChartReady && moodValues.length > 0 ? (
                        <Pie data={pieData} options={pieOptions} />
                      ) : (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '120px' }}>No data for this month</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ai-white-box">
                  <h6 className="ai-subtitle">Summarize AI</h6>
                  <div className="ai-icon-center">
                    <img src={aiIcon} className="ai-icon-img" alt="AI Icon" />
                  </div>
                  <button className="btn-summarize">Summarize</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-main-row">
            <div className="footer-brand-col">
              <img src={sentraIcon} alt="Sentra" className="footer-logo-img" />
            </div>
            <div className="footer-links-grid">
              <div className="footer-col">
                <h5 className="footer-title">Resources</h5>
                <ul className="footer-links">
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Guides</a></li>
                  <li><a href="#">Webinars</a></li>
                  <li><a href="#">Knowledge Base</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5 className="footer-title">Company</h5>
                <ul className="footer-links">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Partners</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5 className="footer-title">Legal</h5>
                <ul className="footer-links">
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Cookie Policy</a></li>
                  <li><a href="#">Compliance</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">© 2026 Sentra Inc. — All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;