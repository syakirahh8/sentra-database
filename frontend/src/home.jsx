import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./style.css";

// Assets
import sentraIcon from "./assets/Sentra Icon.svg";
import starIcon from "./assets/star.svg";
import heroImg from "./assets/sentra-hero.svg";

import card1 from "./assets/card-1.svg";
import card2 from "./assets/card-2.svg";
import card3 from "./assets/card-3.svg";
import card4 from "./assets/card-4.svg";

import chara1 from "./assets/chara-1.svg";
import chara2 from "./assets/chara-2.svg";
import chara3 from "./assets/chara-3.svg";
import chara4 from "./assets/chara-4.svg";

import folder1 from "./assets/folder1.svg";
import folder2 from "./assets/folder2.svg";
import folder3 from "./assets/folder3.svg";
import folder4 from "./assets/folder4.svg";
import folder5 from "./assets/folder5.svg";

import answer1 from "./assets/answer-1.svg";
import answer2 from "./assets/answer-2.svg";
import answer3 from "./assets/answer-3.svg";
import answer4 from "./assets/answer-4.svg";
import answer5 from "./assets/answer-5.svg";
import answer6 from "./assets/answer-6.svg";

import vector1 from "./assets/vector-1.svg";
import vector2 from "./assets/vector-2.svg";
import vector3 from "./assets/vector-3.svg";
import vector4 from "./assets/vector-4.svg";

function Home() {
  const [faqModal, setFaqModal] = useState({ show: false, img: null });

  const openFAQ = (img) => {
    setFaqModal({ show: true, img });
  };

  const closeFAQ = () => {
    setFaqModal({ show: false, img: null });
  };

  return (
    <div className="home-page">

      <nav className="navbar custom-navbar px-5">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <img className="logo-icon" src={sentraIcon} alt="" />
          <Link to="/login" className="btn btn-login">Login</Link>
        </div>
      </nav>

      <section>
        <div className="container hero-container my-5">
          <div className="card hero-custom-card text-center position-relative">
            <img src={starIcon} className="star star-left" alt="" />
            <img src={starIcon} className="star star-right" alt="" />
            <img src={heroImg} className="logo-img" alt="" />

            <div className="card-body">
              <h3>
                No matter your problems are, <br />
                put your mood in{" "}
                <span className="highlight">
                  <img src={sentraIcon} alt="" />
                </span>
              </h3>
            </div>
          </div>
        </div>

        <div className="tag-container my-5">
          <div className="scroll-wrapper">
            <div className="scroll-content">
              {["Belajar MTK", "Kopi Tumpah", "Losestreak ML", "Kehujanan", "Salkir chat", "WiFi lemot", "Kesiangan", "Laptop Hang", "Error Code"].map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
              {["Belajar MTK", "Kopi Tumpah", "Losestreak ML", "Kehujanan", "Salkir chat", "WiFi lemot", "Kesiangan", "Laptop Hang", "Error Code"].map((tag, i) => (
                <span key={`dup-${i}`} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="hero-divider-dashed"></div>

      <section className="how-to-use">
        <h1 className="text-center">How to Use</h1>

        <div className="container my-5">
          <div className="row g-4">

            <StepCard num="1" title="Create Your Account" sub="Always keep it secret" img={card1} cls="step-card-1" />
            <StepCard num="2" title="Log Your Daily Mood" sub="Track your mood" img={card2} cls="step-card-2" />
            <StepCard num="3" title="Track Your History" sub="See patterns" img={card3} cls="step-card-3" />
            <StepCard num="4" title="See Weekly Insights" sub="Understand trends" img={card4} cls="step-card-4" />

          </div>
        </div>
      </section>

      <div className="divider-dashed"></div>

      <section className="how-to-help">
        <img src={vector1} className="vector-corner v-top-left" alt="" />
        <img src={vector2} className="vector-corner v-top-right" alt="" />
        <img src={vector3} className="vector-corner v-bottom-left" alt="" />
        <img src={vector4} className="vector-corner v-bottom-right" alt="" />

        <h1 className="text-center">How Sentra Helps You?</h1>

        <div className="container my-5">
          <div className="row g-4">
            <HowCard title="Build healthier daily habits consistently" text="Turn mood insights into better daily habits." img={chara1} cls="how-card-1" />
            <HowCard title="Reflect on your daily experiences" text="Look back on your day and understand emotions." img={chara2} cls="how-card-2" />
            <HowCard title="Discover patterns in your mood" text="Understand how your mood changes daily." img={chara3} cls="how-card-3" />

            <div className="col-md-10 col-lg-8 mt-5 mx-auto">
              <div className="tracking-card">
                <div className="chara-container">
                  <img src={chara4} alt="" />
                </div>

                <div className="content-container">
                  <h3>Start Tracking Your Mood Today</h3>
                  <p>Small daily checkins can help you understand your emotions and build healthier habits over time.</p>
                  <Link to="/login" className="btn-get-started">Get Started</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-divider-dashed"></div>

      <section className="faq-section my-5">
        <h1 className="text-center">FAQ</h1>

        <div className="container">
          <div className="row g-4 justify-content-center">

            <FAQItem img={folder1} onClick={() => openFAQ(answer1)} text="What is Sentra about?" />
            <FAQItem img={folder2} onClick={() => openFAQ(answer2)} text="Is my personal data private?" />
            <FAQItem img={folder3} onClick={() => openFAQ(answer3)} text="How often should I track my mood?" />
            <FAQItem img={folder3} onClick={() => openFAQ(answer4)} text="Can I see my mood history?" />
            <FAQItem img={folder4} onClick={() => openFAQ(answer5)} text="Can tracking improve habits?" />
            <FAQItem img={folder5} onClick={() => openFAQ(answer6)} text="How does Sentra show patterns?" />

          </div>
        </div>
      </section>

      {faqModal.show && (
        <>
          <div className="faq-overlay" onClick={closeFAQ}></div>
          <div className="faq-modal show">
            <div className="faq-card">
              <img src={faqModal.img} alt="" />
            </div>
          </div>
        </>
      )}

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

function StepCard({ num, title, sub, img, cls }) {
  return (
    <div className="col-md-3">
      <div className={cls}>
        <div className={`step-number-${num}`}>{num}</div>
        <h2>{title}</h2>
        <h5>{sub}</h5>
        <img src={img} alt="" />
      </div>
    </div>
  );
}

function HowCard({ title, text, img, cls }) {
  return (
    <div className="col-md-4">
      <div className={cls}>
        <h4>{title}</h4>
        <p>{text}</p>
        <img src={img} alt="" />
      </div>
    </div>
  );
}

function FAQItem({ img, onClick, text }) {
  return (
    <div className="col-md-4 text-center">
      <div className="faq-item" onClick={onClick}>
        <img src={img} className="faq-img" alt="" />
        <p className="faq-question">{text}</p>
      </div>
    </div>
  );
}

export default Home;
