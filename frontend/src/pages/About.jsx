
import React from "react";

export default function About() {

  const css = `
  /* ============================================================
     SUNRISE DENTAL CLINIC - ABOUT PAGE
     MODERN PROFESSIONAL DESIGN
  ============================================================ */

  * {
    box-sizing: border-box;
  }

  .sd-about-page {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background: #f5f9fc;
    color: #173f63;
    font-family: Arial, Helvetica, sans-serif;
    overflow-x: hidden;
  }


  /* ============================================================
     HEADER
  ============================================================ */

  .sd-about-header {
    height: 78px;
    width: 100%;
    padding: 0 6%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: #0b3153;
    color: white;

    box-shadow: 0 4px 20px rgba(12, 49, 83, 0.12);

    position: relative;
    z-index: 10;
  }

  .sd-about-brand {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .sd-about-brand-icon {
    width: 43px;
    height: 43px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background: rgba(255,255,255,0.12);

    font-size: 22px;

    border: 1px solid rgba(255,255,255,0.12);
  }

  .sd-about-brand-text {
    display: flex;
    flex-direction: column;
  }

  .sd-about-brand-text strong {
    color: white;
    font-size: 15px;
    letter-spacing: 1px;
  }

  .sd-about-brand-text span {
    margin-top: 3px;
    color: rgba(255,255,255,0.55);
    font-size: 8px;
    letter-spacing: 1.2px;
  }

  .sd-about-dashboard {
    height: 42px;
    padding: 0 19px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 9px;

    background: rgba(255,255,255,0.05);

    color: white;

    text-decoration: none;

    font-size: 10px;
    font-weight: 700;

    transition: all .25s ease;
  }

  .sd-about-dashboard:hover {
    background: white;
    color: #0b3153;
    transform: translateY(-2px);
  }


  /* ============================================================
     MAIN CONTAINER
  ============================================================ */

  .sd-about-main {
    width: min(1250px, calc(100% - 40px));

    margin: auto;

    padding: 48px 0 70px;
  }


  /* ============================================================
     HERO
  ============================================================ */

  .sd-about-hero {
    min-height: 405px;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    overflow: hidden;

    padding: 52px 58px;

    border-radius: 24px;

    background:
      linear-gradient(
        120deg,
        #0a3152 0%,
        #11516f 55%,
        #167b82 100%
      );

    box-shadow:
      0 20px 45px rgba(15, 65, 90, .16);
  }

  .sd-about-hero::before {
    content: "";

    position: absolute;

    width: 330px;
    height: 330px;

    right: -100px;
    top: -120px;

    border-radius: 50%;

    border: 1px solid rgba(255,255,255,.10);
  }

  .sd-about-hero::after {
    content: "";

    position: absolute;

    width: 220px;
    height: 220px;

    right: 80px;
    bottom: -140px;

    border-radius: 50%;

    background: rgba(255,255,255,.05);
  }

  .sd-about-hero-content {
    width: 62%;

    position: relative;
    z-index: 2;
  }

  .sd-about-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    margin-bottom: 16px;

    color: #9ee1e3;

    font-size: 9px;
    font-weight: 800;

    letter-spacing: 2px;
  }

  .sd-about-kicker::before {
    content: "";

    width: 25px;
    height: 2px;

    background: #7fd5d9;
  }

  .sd-about-hero h1 {
    margin: 0 0 18px;

    color: white;

    font-size: clamp(30px, 4vw, 48px);

    line-height: 1.12;

    letter-spacing: -1px;
  }

  .sd-about-hero h1 span {
    color: #9de3e5;
  }

  .sd-about-hero p {
    max-width: 620px;

    margin: 0;

    color: rgba(255,255,255,.72);

    font-size: 13px;

    line-height: 1.8;
  }

  .sd-about-hero-actions {
    display: flex;
    gap: 10px;

    margin-top: 27px;
  }

  .sd-primary-btn {
    padding: 12px 19px;

    border: 0;
    border-radius: 8px;

    background: white;

    color: #0d4e68;

    font-size: 9px;
    font-weight: 800;

    text-decoration: none;

    transition: .25s;
  }

  .sd-primary-btn:hover {
    transform: translateY(-2px);

    box-shadow:
      0 8px 20px rgba(0,0,0,.15);
  }

  .sd-secondary-btn {
    padding: 11px 18px;

    border: 1px solid rgba(255,255,255,.25);
    border-radius: 8px;

    background: transparent;

    color: white;

    font-size: 9px;
    font-weight: 700;

    text-decoration: none;

    transition: .25s;
  }

  .sd-secondary-btn:hover {
    background: rgba(255,255,255,.1);
  }


  /* ============================================================
     HERO TOOTH
  ============================================================ */

  .sd-about-visual {
    width: 32%;
    min-height: 280px;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 2;
  }

  .sd-tooth-circle {
    width: 190px;
    height: 190px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background: rgba(255,255,255,.08);

    border: 1px solid rgba(255,255,255,.17);

    box-shadow:
      0 0 0 20px rgba(255,255,255,.025);

    font-size: 88px;

    animation: toothFloat 4s ease-in-out infinite;
  }

  @keyframes toothFloat {

    0%,100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-10px);
    }

  }

  .sd-floating-info {
    position: absolute;

    right: -4px;
    bottom: 24px;

    min-width: 145px;

    padding: 14px;

    background: white;

    border-radius: 12px;

    box-shadow:
      0 15px 30px rgba(0,0,0,.18);
  }

  .sd-floating-info small {
    display: block;

    margin-bottom: 4px;

    color: #8c9ba3;

    font-size: 7px;
    font-weight: 800;

    letter-spacing: 1px;
  }

  .sd-floating-info strong {
    color: #164c67;

    font-size: 12px;
  }

  .sd-floating-info span {
    display: block;

    margin-top: 4px;

    color: #6d8b98;

    font-size: 7px;
  }


  /* ============================================================
     SECTION TITLE
  ============================================================ */

  .sd-section-heading {
    text-align: center;

    margin: 55px 0 25px;
  }

  .sd-section-heading span {
    display: block;

    margin-bottom: 8px;

    color: #238b91;

    font-size: 8px;

    font-weight: 800;

    letter-spacing: 2px;
  }

  .sd-section-heading h2 {
    margin: 0;

    color: #153f60;

    font-size: 26px;
  }

  .sd-section-heading p {
    max-width: 570px;

    margin: 9px auto 0;

    color: #7a909f;

    font-size: 10px;

    line-height: 1.7;
  }


  /* ============================================================
     FEATURES
  ============================================================ */

  .sd-feature-grid {
    display: grid;

    grid-template-columns:
      repeat(3, 1fr);

    gap: 18px;
  }

  .sd-feature-card {
    position: relative;

    padding: 25px;

    background: white;

    border: 1px solid #dfebf1;

    border-radius: 15px;

    box-shadow:
      0 7px 25px rgba(21, 66, 91, .055);

    overflow: hidden;

    transition:
      transform .25s ease,
      box-shadow .25s ease;
  }

  .sd-feature-card::after {
    content: "";

    position: absolute;

    width: 70px;
    height: 70px;

    right: -25px;
    top: -25px;

    border-radius: 50%;

    background: #edf8f9;
  }

  .sd-feature-card:hover {
    transform: translateY(-7px);

    box-shadow:
      0 18px 35px rgba(21, 66, 91, .10);
  }

  .sd-feature-number {
    position: relative;
    z-index: 2;

    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 18px;

    border-radius: 11px;

    background: #e9f6f7;

    color: #13818a;

    font-size: 10px;

    font-weight: 800;
  }

  .sd-feature-card h3 {
    margin: 0 0 9px;

    color: #173f60;

    font-size: 16px;
  }

  .sd-feature-card p {
    margin: 0;

    color: #7b909d;

    font-size: 10px;

    line-height: 1.75;
  }


  /* ============================================================
     STORY / MISSION
  ============================================================ */

  .sd-story-section {
    display: grid;

    grid-template-columns:
      1.1fr .9fr;

    gap: 20px;

    margin-top: 45px;
  }

  .sd-story-card {
    padding: 32px;

    background: white;

    border: 1px solid #dfe9ef;

    border-radius: 17px;

    box-shadow:
      0 7px 25px rgba(21, 66, 91, .05);
  }

  .sd-story-card.accent {
    background:
      linear-gradient(
        145deg,
        #0c3455,
        #145d76
      );

    color: white;
  }

  .sd-story-label {
    display: block;

    margin-bottom: 10px;

    color: #2b9298;

    font-size: 8px;

    font-weight: 800;

    letter-spacing: 1.8px;
  }

  .accent .sd-story-label {
    color: #9fe1e3;
  }

  .sd-story-card h2 {
    margin: 0 0 14px;

    color: #163f60;

    font-size: 23px;

    line-height: 1.3;
  }

  .accent h2 {
    color: white;
  }

  .sd-story-card p {
    margin: 0;

    color: #718895;

    font-size: 10px;

    line-height: 1.9;
  }

  .accent p {
    color: rgba(255,255,255,.67);
  }


  /* ============================================================
     VALUES
  ============================================================ */

  .sd-values {
    display: grid;

    grid-template-columns:
      repeat(2, 1fr);

    gap: 12px;

    margin-top: 20px;
  }

  .sd-value {
    padding: 15px;

    border-radius: 10px;

    background: #f5fafb;

    border: 1px solid #e4eef1;
  }

  .sd-value strong {
    display: block;

    margin-bottom: 5px;

    color: #24526a;

    font-size: 10px;
  }

  .sd-value span {
    color: #8297a2;

    font-size: 8px;

    line-height: 1.5;
  }


  /* ============================================================
     STATS
  ============================================================ */

  .sd-stat-section {
    margin-top: 45px;

    padding: 27px;

    display: grid;

    grid-template-columns:
      repeat(4, 1fr);

    gap: 12px;

    border-radius: 17px;

    background: #edf5f8;

    border: 1px solid #dce9ee;
  }

  .sd-stat {
    padding: 17px;

    text-align: center;

    border-right: 1px solid #d6e4e9;
  }

  .sd-stat:last-child {
    border-right: 0;
  }

  .sd-stat strong {
    display: block;

    margin-bottom: 5px;

    color: #0d687d;

    font-size: 25px;
  }

  .sd-stat span {
    color: #718995;

    font-size: 8px;

    font-weight: 700;

    letter-spacing: .5px;
  }


  /* ============================================================
     WHY CHOOSE US
  ============================================================ */

  .sd-why-grid {
    display: grid;

    grid-template-columns:
      repeat(3, 1fr);

    gap: 15px;

    margin-top: 25px;
  }

  .sd-why-card {
    padding: 22px;

    background: white;

    border-radius: 13px;

    border: 1px solid #e0e9ee;
  }

  .sd-why-icon {
    width: 39px;
    height: 39px;

    display: flex;

    align-items: center;
    justify-content: center;

    margin-bottom: 12px;

    border-radius: 10px;

    background: #eaf5f7;

    color: #14828b;

    font-size: 16px;
  }

  .sd-why-card h3 {
    margin: 0 0 7px;

    color: #234c63;

    font-size: 12px;
  }

  .sd-why-card p {
    margin: 0;

    color: #8296a0;

    font-size: 9px;

    line-height: 1.65;
  }


  /* ============================================================
     CTA
  ============================================================ */

  .sd-about-cta {
    position: relative;

    overflow: hidden;

    margin-top: 45px;

    padding: 36px 40px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    border-radius: 17px;

    background:
      linear-gradient(
        110deg,
        #0d3656,
        #12657a
      );
  }

  .sd-about-cta::after {
    content: "✦";

    position: absolute;

    right: 35px;
    top: -30px;

    color: rgba(255,255,255,.07);

    font-size: 150px;
  }

  .sd-about-cta h2 {
    position: relative;
    z-index: 2;

    margin: 0 0 7px;

    color: white;

    font-size: 21px;
  }

  .sd-about-cta p {
    position: relative;
    z-index: 2;

    margin: 0;

    color: rgba(255,255,255,.62);

    font-size: 9px;
  }

  .sd-cta-btn {
    position: relative;
    z-index: 3;

    padding: 12px 20px;

    border-radius: 8px;

    background: white;

    color: #0c526b;

    text-decoration: none;

    font-size: 9px;

    font-weight: 800;

    white-space: nowrap;

    transition: .2s;
  }

  .sd-cta-btn:hover {
    transform: translateY(-2px);

    box-shadow:
      0 8px 20px rgba(0,0,0,.15);
  }


  /* ============================================================
     FOOTER
  ============================================================ */

  .sd-about-footer {
    margin-top: 55px;

    padding: 27px 6%;

    background: #092c49;

    color: white;
  }

  .sd-footer-inner {
    width: min(1250px, 100%);

    margin: auto;

    display: flex;

    align-items: center;

    justify-content: space-between;
  }

  .sd-footer-brand strong {
    display: block;

    font-size: 12px;

    letter-spacing: 1px;
  }

  .sd-footer-brand span {
    display: block;

    margin-top: 5px;

    color: rgba(255,255,255,.48);

    font-size: 7px;
  }

  .sd-footer-copy {
    color: rgba(255,255,255,.42);

    font-size: 8px;
  }


  /* ============================================================
     RESPONSIVE
  ============================================================ */

  @media (max-width: 900px) {

    .sd-about-hero {
      padding: 42px;
    }

    .sd-about-hero-content {
      width: 65%;
    }

    .sd-about-visual {
      width: 30%;
    }

    .sd-tooth-circle {
      width: 150px;
      height: 150px;

      font-size: 65px;
    }

    .sd-feature-grid,
    .sd-why-grid {
      grid-template-columns: 1fr 1fr;
    }

    .sd-story-section {
      grid-template-columns: 1fr;
    }

  }


  @media (max-width: 700px) {

    .sd-about-header {
      height: 70px;

      padding: 0 20px;
    }

    .sd-about-brand-text span {
      display: none;
    }

    .sd-about-brand-text strong {
      font-size: 12px;
    }

    .sd-about-dashboard {
      height: 36px;

      padding: 0 12px;

      font-size: 8px;
    }

    .sd-about-main {
      width: calc(100% - 24px);

      padding-top: 18px;
    }

    .sd-about-hero {
      min-height: auto;

      flex-direction: column;

      align-items: flex-start;

      padding: 30px 25px;
    }

    .sd-about-hero-content {
      width: 100%;
    }

    .sd-about-hero h1 {
      font-size: 31px;
    }

    .sd-about-hero p {
      font-size: 10px;
    }

    .sd-about-visual {
      width: 100%;

      min-height: 170px;

      margin-top: 15px;
    }

    .sd-tooth-circle {
      width: 130px;
      height: 130px;

      font-size: 58px;
    }

    .sd-floating-info {
      right: 20px;
      bottom: 0;
    }

    .sd-feature-grid,
    .sd-why-grid {
      grid-template-columns: 1fr;
    }

    .sd-story-section {
      grid-template-columns: 1fr;
    }

    .sd-stat-section {
      grid-template-columns: 1fr 1fr;

      padding: 15px;
    }

    .sd-stat {
      border-right: 0;

      border-bottom: 1px solid #d6e4e9;
    }

    .sd-stat:nth-child(3),
    .sd-stat:nth-child(4) {
      border-bottom: 0;
    }

    .sd-about-cta {
      flex-direction: column;

      align-items: flex-start;

      gap: 20px;

      padding: 28px 24px;
    }

    .sd-footer-inner {
      flex-direction: column;

      align-items: flex-start;

      gap: 13px;
    }

  }


  @media (max-width: 430px) {

    .sd-about-hero h1 {
      font-size: 27px;
    }

    .sd-about-hero-actions {
      flex-direction: column;
    }

    .sd-primary-btn,
    .sd-secondary-btn {
      width: 100%;

      text-align: center;
    }

    .sd-stat strong {
      font-size: 21px;
    }

    .sd-section-heading h2 {
      font-size: 22px;
    }

  }
  `;

  return (
    <div className="sd-about-page">

      <style>{css}</style>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sd-about-header">

        <div className="sd-about-brand">

          <div className="sd-about-brand-icon">
            🦷
          </div>

          <div className="sd-about-brand-text">

            <strong>
              SUNRISE DENTAL
            </strong>

            <span>
              PROFESSIONAL DENTAL CARE
            </span>

          </div>

        </div>


        <a
          href="/dashboard"
          className="sd-about-dashboard"
        >
          ← Dashboard
        </a>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="sd-about-main">


        {/* ===================================================
            HERO
        =================================================== */}

        <section className="sd-about-hero">

          <div className="sd-about-hero-content">

            <span className="sd-about-kicker">
              SUNRISE DENTAL CLINIC
            </span>

            <h1>
              Modern dentistry,
              <br />
              <span>centred around you.</span>
            </h1>

            <p>
              At Sunrise Dental, we combine compassionate
              patient care with modern digital technology to
              make every dental visit simple, organised and
              comfortable.
            </p>


            <div className="sd-about-hero-actions">

              <a
                href="/appointments"
                className="sd-primary-btn"
              >
                Book an Appointment
              </a>

              <a
                href="/dashboard"
                className="sd-secondary-btn"
              >
                Explore Dashboard
              </a>

            </div>

          </div>


          <div className="sd-about-visual">

            <div className="sd-tooth-circle">
              🦷
            </div>

            <div className="sd-floating-info">

              <small>
                OUR APPROACH
              </small>

              <strong>
                Care. Comfort. Trust.
              </strong>

              <span>
                Designed around every patient.
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            FEATURES
        =================================================== */}

        <div className="sd-section-heading">

          <span>
            WHAT WE STAND FOR
          </span>

          <h2>
            A better dental care experience
          </h2>

          <p>
            Our clinic management approach connects patients,
            dentists and reception staff through one organised
            digital environment.
          </p>

        </div>


        <section className="sd-feature-grid">

          <div className="sd-feature-card">

            <div className="sd-feature-number">
              01
            </div>

            <h3>
              Patient First
            </h3>

            <p>
              Clear appointments, accessible records and
              direct communication help patients stay informed
              throughout their care journey.
            </p>

          </div>


          <div className="sd-feature-card">

            <div className="sd-feature-number">
              02
            </div>

            <h3>
              Clinical Excellence
            </h3>

            <p>
              Dentists can manage appointments, review patient
              information and maintain prescription records
              through one professional workspace.
            </p>

          </div>


          <div className="sd-feature-card">

            <div className="sd-feature-number">
              03
            </div>

            <h3>
              Trusted Service
            </h3>

            <p>
              Role-based access helps protect patient
              information while allowing authorised staff to
              manage clinic operations efficiently.
            </p>

          </div>

        </section>


        {/* ===================================================
            STORY
        =================================================== */}

        <section className="sd-story-section">


          <div className="sd-story-card">

            <span className="sd-story-label">
              OUR STORY
            </span>

            <h2>
              Professional care with a human touch.
            </h2>

            <p>
              Sunrise Dental is designed around a simple idea:
              dental care should be easier to understand and
              easier to manage. From booking an appointment to
              receiving treatment instructions, every interaction
              is organised around the patient.
            </p>


            <div className="sd-values">

              <div className="sd-value">

                <strong>
                  Compassion
                </strong>

                <span>
                  We put patient comfort and understanding first.
                </span>

              </div>


              <div className="sd-value">

                <strong>
                  Professionalism
                </strong>

                <span>
                  We maintain organised and reliable clinical
                  processes.
                </span>

              </div>


              <div className="sd-value">

                <strong>
                  Technology
                </strong>

                <span>
                  Digital tools simplify everyday clinic
                  management.
                </span>

              </div>


              <div className="sd-value">

                <strong>
                  Trust
                </strong>

                <span>
                  Patient information is handled responsibly
                  and securely.
                </span>

              </div>

            </div>

          </div>


          <div className="sd-story-card accent">

            <span className="sd-story-label">
              OUR PROMISE
            </span>

            <h2>
              Healthcare technology that feels human.
            </h2>

            <p>
              We believe technology should support people,
              not make healthcare complicated. Our digital
              platform helps the dental team spend less time
              managing paperwork and more time caring for
              patients.
            </p>

          </div>

        </section>


        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="sd-stat-section">

          <div className="sd-stat">

            <strong>
              24/7
            </strong>

            <span>
              DIGITAL ACCESS
            </span>

          </div>


          <div className="sd-stat">

            <strong>
              4+
            </strong>

            <span>
              CARE FUNCTIONS
            </span>

          </div>


          <div className="sd-stat">

            <strong>
              1
            </strong>

            <span>
              CONNECTED CLINIC
            </span>

          </div>


          <div className="sd-stat">

            <strong>
              100%
            </strong>

            <span>
              PATIENT FOCUSED
            </span>

          </div>

        </section>


        {/* ===================================================
            WHY CHOOSE US
        =================================================== */}

        <div className="sd-section-heading">

          <span>
            WHY SUNRISE DENTAL
          </span>

          <h2>
            Designed for better care
          </h2>

        </div>


        <section className="sd-why-grid">


          <div className="sd-why-card">

            <div className="sd-why-icon">
              ✓
            </div>

            <h3>
              Easy Appointments
            </h3>

            <p>
              Patients can manage their appointments through
              a clear and simple digital experience.
            </p>

          </div>


          <div className="sd-why-card">

            <div className="sd-why-icon">
              ♡
            </div>

            <h3>
              Patient-Centred Care
            </h3>

            <p>
              Every feature is designed to make communication
              and patient interactions easier.
            </p>

          </div>


          <div className="sd-why-card">

            <div className="sd-why-icon">
              🔒
            </div>

            <h3>
              Protected Information
            </h3>

            <p>
              Access to clinical information is organised
              according to authorised user roles.
            </p>

          </div>


          <div className="sd-why-card">

            <div className="sd-why-icon">
              🩺
            </div>

            <h3>
              Dentist Workspace
            </h3>

            <p>
              Dentists can review appointments and maintain
              relevant treatment and prescription information.
            </p>

          </div>


          <div className="sd-why-card">

            <div className="sd-why-icon">
              ⚡
            </div>

            <h3>
              Faster Clinic Operations
            </h3>

            <p>
              Digital workflows reduce unnecessary manual
              processes and improve everyday efficiency.
            </p>

          </div>


          <div className="sd-why-card">

            <div className="sd-why-icon">
              ✦
            </div>

            <h3>
              Modern Experience
            </h3>

            <p>
              A clean interface gives patients and clinic staff
              a professional digital environment.
            </p>

          </div>

        </section>


        {/* ===================================================
            CALL TO ACTION
        =================================================== */}

        <section className="sd-about-cta">

          <div>

            <h2>
              Your smile deserves thoughtful care.
            </h2>

            <p>
              Experience a simpler and more organised dental
              care journey with Sunrise Dental Clinic.
            </p>

          </div>

          <a
            href="/appointments"
            className="sd-cta-btn"
          >
            Book an Appointment →
          </a>

        </section>


      </main>


     
    </div>
  );
}
