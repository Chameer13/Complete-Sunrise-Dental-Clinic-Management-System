import React from "react";

export default function About() {
  const css = `
  /* ===========================
     SUNRISE DENTAL - ABOUT PAGE
     =========================== */

  .sd-feedback-page {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background: #f3f7fb;
    color: #173f63;
    font-family: Arial, Helvetica, sans-serif;
  }

  /* HEADER */
  .sd-feedback-header {
    width: 100%;
    height: 76px;
    margin: 0;
    padding: 0 6%;
    background: #0d3154;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .sd-feedback-header-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.3px;
  }

  .sd-feedback-header-icon {
    font-size: 17px;
  }

  .sd-feedback-dashboard {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    min-width: 114px;
    padding: 0 20px;
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 9px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .sd-feedback-dashboard:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: white;
    color: white;
  }

  /* MAIN */
  .sd-feedback-main {
    width: 100%;
    max-width: 1268px;
    margin: 0 auto;
    padding: 45px 30px 70px;
    box-sizing: border-box;
  }

  /* HERO SECTION */
  .feature-hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .feature-hero > div {
    max-width: 60%;
  }

  .feature-kicker {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: #4384b0;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .feature-hero h1 {
    font-size: 36px;
    margin: 0 0 20px;
    color: #123f66;
    line-height: 1.2;
  }

  .feature-hero p {
    font-size: 16px;
    line-height: 1.8;
    color: #637d94;
  }

  .about-orb {
    font-size: 80px;
    text-align: center;
  }

  /* FEATURES GRID */
  .feature-grid {
    display: flex;
    gap: 20px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .feature-card {
    background: white;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #d9e5ee;
    flex: 1 1 calc(33% - 20px);
    box-shadow: 0 8px 28px rgba(20, 60, 90, 0.07);
  }

  .feature-card span {
    font-size: 24px;
    font-weight: bold;
    display: block;
    margin-bottom: 10px;
  }

  .feature-card h2 {
    font-size: 20px;
    margin: 0 0 10px;
    color: #123f66;
  }

  /* ABOUT PROMISE */
  .about-story {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;
  }

  .about-story > div {
    background: white;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #dbe5ed;
    box-shadow: 0 5px 18px rgba(20, 55, 85, 0.05);
  }

  .about-story h2 {
    font-size: 24px;
    margin-top: 10px;
    color: #123f66;
  }

  .about-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .about-stats > b {
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    background: #f1f1f1;
  }

  /* RESPONSIVE */
  @media(max-width: 700px) {
    .feature-hero {
      flex-direction: column;
    }
    .feature-grid {
      flex-direction: column;
    }
    .feature-card {
      flex: 1 1 100%;
    }
  }
  `;

  return (
    <div className="sd-feedback-page">
      {/* Inject CSS styles */}
      <style>{css}</style>

      {/* HEADER */}
      <header className="sd-feedback-header">
        <div className="sd-feedback-header-title">
          <span className="sd-feedback-header-icon">✦</span>
          <span>FEEDBACK</span>
        </div>
        <a href="/dashboard" className="sd-feedback-dashboard">
          Dashboard
        </a>
      </header>

      {/* MAIN CONTENT */}
      <main className="sd-feedback-main">
        {/* Hero Section */}
        <section className="feature-hero about-hero">
          <div>
            <span className="feature-kicker">SUNRISE DENTAL CLINIC</span>
            <h1>Modern dentistry, centred around you.</h1>
            <p>
              We combine compassionate patient care with organised digital clinic management so every visit feels simple, safe and professional.
            </p>
          </div>
          <div className="about-orb">🦷</div>
        </section>

        {/* Features Grid */}
        <section className="feature-grid">
          <div className="feature-card">
            <span>01</span>
            <h2>Patient First</h2>
            <p>Clear appointments, personal records and direct communication help patients stay informed throughout their care journey.</p>
          </div>
          <div className="feature-card">
            <span>02</span>
            <h2>Clinical Excellence</h2>
            <p>Our dentist workspace supports appointment management, patient updates and prescription recording in one place.</p>
          </div>
          <div className="feature-card">
            <span>03</span>
            <h2>Trusted Service</h2>
            <p>Role-based access keeps patient information protected while reception staff can support the front desk efficiently.</p>
          </div>
        </section>

        {/* About Promise */}
        <section className="about-story">
          <div>
            <span className="feature-kicker">OUR PROMISE</span>
            <h2>Professional care with a human touch.</h2>
            <p>
              Sunrise Dental is designed around a simple idea: dental care should be easier to understand and easier to manage. From booking a visit to receiving treatment instructions, every interaction is organised around the patient.
            </p>
          </div>
          <div className="about-stats">
            <b>
              <strong>24/7</strong>
              <small>Digital access</small>
            </b>
            <b>
              <strong>4</strong>
              <small>Care roles</small>
            </b>
            <b>
              <strong>1</strong>
              <small>Connected clinic</small>
            </b>
          </div>
        </section>
      </main>
    </div>
  );
}