import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const css = `
/* =========================================================
   SUNRISE DENTAL - FEEDBACK PAGE
   ========================================================= */

.sd-feedback-page {
  min-height: 100vh !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #f3f7fb !important;
  color: #173f63 !important;
  font-family: Arial, Helvetica, sans-serif !important;
}

/* =========================================================
   HEADER
   ========================================================= */

.sd-feedback-header {
  width: 100% !important;
  height: 76px !important;
  margin: 0 !important;
  padding: 0 6% !important;

  background: #0d3154 !important;
  color: white !important;

  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;

  box-sizing: border-box !important;
}

.sd-feedback-header-title {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;

  color: white !important;
  font-size: 22px !important;
  font-weight: 800 !important;
  letter-spacing: 0.3px !important;
}

.sd-feedback-header-icon {
  color: white !important;
  font-size: 17px !important;
}

.sd-feedback-dashboard {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  height: 44px !important;
  min-width: 114px !important;
  padding: 0 20px !important;

  background: transparent !important;
  color: white !important;

  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  border-radius: 9px !important;

  text-decoration: none !important;

  font-size: 14px !important;
  font-weight: 700 !important;

  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.sd-feedback-dashboard:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: white !important;
  color: white !important;
}

/* =========================================================
   MAIN CONTENT
   ========================================================= */

.sd-feedback-main {
  width: 100% !important;
  max-width: 1268px !important;

  margin: 0 auto !important;
  padding: 45px 30px 70px !important;

  box-sizing: border-box !important;
}

/* =========================================================
   INTRO
   ========================================================= */

.sd-feedback-label {
  margin: 0 0 12px !important;

  color: #4384b0 !important;

  font-size: 13px !important;
  font-weight: 800 !important;
  letter-spacing: 3px !important;
  text-transform: uppercase !important;
}

.sd-feedback-title {
  margin: 0 0 15px !important;

  color: #123f66 !important;

  font-size: 38px !important;
  line-height: 1.2 !important;
  font-weight: 800 !important;
}

.sd-feedback-description {
  max-width: 900px !important;

  margin: 0 0 30px !important;

  color: #637d94 !important;

  font-size: 16px !important;
  line-height: 1.8 !important;
}

/* =========================================================
   FEEDBACK CARD
   ========================================================= */

.sd-feedback-card {
  width: 100% !important;
  max-width: 100% !important;

  background: white !important;

  border: 1px solid #d9e5ee !important;
  border-radius: 16px !important;

  padding: 30px !important;
  margin: 0 0 32px !important;

  box-sizing: border-box !important;

  box-shadow: 0 8px 28px rgba(20, 60, 90, 0.07) !important;
}

/* =========================================================
   RATING
   ========================================================= */

.sd-feedback-field {
  margin-bottom: 24px !important;
}

.sd-feedback-field-label {
  display: block !important;

  margin: 0 0 10px !important;

  color: #234e70 !important;

  font-size: 14px !important;
  font-weight: 700 !important;
}

.sd-feedback-stars {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
}

.sd-feedback-star {
  padding: 0 !important;
  margin: 0 !important;

  background: transparent !important;
  border: none !important;

  color: #d5dce2 !important;

  font-size: 34px !important;
  line-height: 1 !important;

  cursor: pointer !important;

  transition: transform 0.15s ease, color 0.15s ease !important;
}

.sd-feedback-star:hover {
  transform: scale(1.12) !important;
}

.sd-feedback-star.active {
  color: #e7a526 !important;
}

/* =========================================================
   COMMENTS
   ========================================================= */

.sd-feedback-textarea {
  display: block !important;

  width: 100% !important;
  min-height: 145px !important;

  padding: 15px !important;

  box-sizing: border-box !important;

  background: #fbfdff !important;
  color: #284f6c !important;

  border: 1px solid #d4e1ea !important;
  border-radius: 10px !important;

  outline: none !important;

  resize: vertical !important;

  font-family: Arial, Helvetica, sans-serif !important;
  font-size: 15px !important;
  line-height: 1.6 !important;
}

.sd-feedback-textarea:focus {
  background: white !important;

  border-color: #4b8bb7 !important;

  box-shadow: 0 0 0 3px rgba(75, 139, 183, 0.1) !important;
}

/* =========================================================
   SUBMIT BUTTON
   ========================================================= */

.sd-feedback-submit {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  min-width: 150px !important;

  padding: 13px 24px !important;

  background: #0d5d91 !important;
  color: white !important;

  border: none !important;
  border-radius: 9px !important;

  font-size: 14px !important;
  font-weight: 700 !important;

  cursor: pointer !important;

  transition: all 0.2s ease !important;
}

.sd-feedback-submit:hover {
  background: #094b73 !important;
  transform: translateY(-1px) !important;
}

/* =========================================================
   MESSAGE
   ========================================================= */

.sd-feedback-message {
  width: 100% !important;

  margin: 0 0 28px !important;
  padding: 14px 17px !important;

  box-sizing: border-box !important;

  background: #edf7fc !important;
  color: #17628f !important;

  border: 1px solid #cce5f1 !important;
  border-radius: 9px !important;

  font-size: 14px !important;
  font-weight: 600 !important;
}

/* =========================================================
   PREVIOUS FEEDBACK
   ========================================================= */

.sd-feedback-records-title {
  margin: 0 0 20px !important;

  color: #174467 !important;

  font-size: 25px !important;
  font-weight: 800 !important;
}

.sd-feedback-record {
  width: 100% !important;

  margin-bottom: 16px !important;
  padding: 22px !important;

  box-sizing: border-box !important;

  background: white !important;

  border: 1px solid #dbe5ed !important;
  border-radius: 14px !important;

  box-shadow: 0 5px 18px rgba(20, 55, 85, 0.05) !important;
}

.sd-feedback-record-top {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;

  gap: 20px !important;

  margin-bottom: 12px !important;
}

.sd-feedback-patient-name {
  color: #174467 !important;

  font-size: 17px !important;
  font-weight: 800 !important;
}

.sd-feedback-record-stars {
  color: #e7a526 !important;

  font-size: 19px !important;
  letter-spacing: 2px !important;
}

.sd-feedback-record-comment {
  margin: 0 0 10px !important;

  color: #61798e !important;

  font-size: 15px !important;
  line-height: 1.7 !important;
}

.sd-feedback-record-date {
  display: inline-block !important;

  margin-top: 3px !important;

  color: #8a9dac !important;

  font-size: 13px !important;
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

.sd-feedback-empty {
  width: 100% !important;
  min-height: 280px !important;

  padding: 35px !important;

  box-sizing: border-box !important;

  background: white !important;

  border: 1px solid #dbe5ed !important;
  border-radius: 16px !important;

  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;

  text-align: center !important;

  box-shadow: 0 8px 25px rgba(20, 55, 85, 0.04) !important;
}

.sd-feedback-empty-icon {
  margin-bottom: 12px !important;

  font-size: 44px !important;
}

.sd-feedback-empty h3 {
  margin: 6px 0 10px !important;

  color: #173f63 !important;

  font-size: 24px !important;
}

.sd-feedback-empty p {
  margin: 0 !important;

  color: #678096 !important;

  font-size: 15px !important;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 700px) {

  .sd-feedback-header {
    height: 70px !important;
    padding: 0 20px !important;
  }

  .sd-feedback-header-title {
    font-size: 17px !important;
  }

  .sd-feedback-dashboard {
    min-width: auto !important;
    height: 40px !important;
    padding: 0 14px !important;
    font-size: 13px !important;
  }

  .sd-feedback-main {
    padding: 32px 18px 50px !important;
  }

  .sd-feedback-title {
    font-size: 30px !important;
  }

  .sd-feedback-description {
    font-size: 15px !important;
  }

  .sd-feedback-card {
    padding: 20px !important;
  }

  .sd-feedback-record-top {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .sd-feedback-star {
    font-size: 30px !important;
  }
}
`;

/* =========================================================
   DATE / TIME FORMATTER
   =========================================================
   
   Sunrise Dental uses Sri Lanka time.

   If the backend sends:
     2026-09-01T10:30:00Z
   it is already UTC.

   If the backend sends:
     2026-09-01T10:30:00
   without timezone information, this function treats it
   as UTC and converts it to Asia/Colombo.

   This prevents the browser from incorrectly treating a
   timezone-less backend value as the user's local time.
   ========================================================= */

const formatSriLankaDateTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  try {
    let value = String(dateValue).trim();

    if (!value) {
      return "";
    }

    /*
     * If the backend returns a LocalDateTime such as:
     * 2026-09-01T10:30:00
     *
     * There is no timezone information.
     *
     * We explicitly interpret it as UTC.
     */
    if (
      !value.endsWith("Z") &&
      !/[+-]\d{2}:\d{2}$/.test(value)
    ) {
      value = `${value}Z`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      console.warn(
        "Invalid feedback date:",
        dateValue
      );

      return "";
    }

    return new Intl.DateTimeFormat(
      "en-LK",
      {
        timeZone: "Asia/Colombo",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: true
      }
    ).format(date);

  } catch (error) {
    console.error(
      "Date formatting error:",
      error
    );

    return "";
  }
};

export default function Feedback() {
  const { user } = useAuth();

  const staff =
    user?.role === "RECEPTIONIST" ||
    user?.role === "ADMIN";

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");

  /* =====================================================
     LOAD FEEDBACK
     ===================================================== */

  const loadFeedback = async () => {
    try {
      const response = await api.get(
        staff
          ? "/feedback"
          : "/feedback/me"
      );

      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data) {
        setData([response.data]);
      } else {
        setData([]);
      }

    } catch (error) {
      console.error(
        "Feedback loading error:",
        error
      );

      setData([]);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [staff]);

  /* =====================================================
     SUBMIT FEEDBACK
     ===================================================== */

  const submitFeedback = async (e) => {
    e.preventDefault();

    setMsg("");

    if (!comment.trim()) {
      setMsg(
        "Please enter your feedback comment."
      );
      return;
    }

    try {
      await api.post(
        "/feedback",
        {
          rating: Number(rating),
          comment: comment.trim()
        }
      );

      setMsg(
        "Thank you! Your feedback has been submitted successfully."
      );

      setRating(5);
      setComment("");

      /*
       * Reload records from the backend.
       *
       * This ensures that the displayed date/time is the
       * actual saved database timestamp rather than a
       * manually generated frontend timestamp.
       */
      await loadFeedback();

    } catch (error) {
      console.error(
        "Feedback submission error:",
        error
      );

      setMsg(
        error.response?.data?.message ||
        "Could not submit feedback."
      );
    }
  };

  /* =====================================================
     STAR DISPLAY
     ===================================================== */

  const renderStars = (value) => {
    const safeRating = Math.max(
      0,
      Math.min(5, Number(value) || 0)
    );

    return (
      <>
        {"★".repeat(safeRating)}
        {"☆".repeat(5 - safeRating)}
      </>
    );
  };

  return (
    <div className="sd-feedback-page">

      {/* PAGE CSS */}
      <style>{css}</style>

      {/* =================================================
          HEADER
          ================================================= */}

      <header className="sd-feedback-header">

        <div className="sd-feedback-header-title">

          <span className="sd-feedback-header-icon">
            ✦
          </span>

          <span>
            PATIENT FEEDBACK
          </span>

        </div>

        <a
          href="/dashboard"
          className="sd-feedback-dashboard"
        >
          Dashboard
        </a>

      </header>

      {/* =================================================
          MAIN
          ================================================= */}

      <main className="sd-feedback-main">

        <div className="sd-feedback-label">
          PATIENT EXPERIENCE
        </div>

        <h1 className="sd-feedback-title">
          Share Your Sunrise Dental Experience
        </h1>

        <p className="sd-feedback-description">
          Your rating is linked to your patient account and
          stored securely in the clinic database.
        </p>

        {/* =================================================
            PATIENT FORM
            ================================================= */}

        {!staff && (

          <form
            className="sd-feedback-card"
            onSubmit={submitFeedback}
          >

            {/* RATING */}

            <div className="sd-feedback-field">

              <label className="sd-feedback-field-label">
                Rating
              </label>

              <div className="sd-feedback-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      className={
                        "sd-feedback-star " +
                        (
                          star <= rating
                            ? "active"
                            : ""
                        )
                      }
                      onClick={() =>
                        setRating(star)
                      }
                      aria-label={
                        `Rate ${star} out of 5`
                      }
                    >
                      ★
                    </button>

                  )
                )}

              </div>

            </div>

            {/* COMMENTS */}

            <div className="sd-feedback-field">

              <label className="sd-feedback-field-label">
                Comments
              </label>

              <textarea
                className="sd-feedback-textarea"
                placeholder="Tell us about your appointment or experience..."
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="sd-feedback-submit"
            >
              Submit Feedback
            </button>

          </form>

        )}

        {/* =================================================
            MESSAGE
            ================================================= */}

        {msg && (

          <div className="sd-feedback-message">
            {msg}
          </div>

        )}

        {/* =================================================
            FEEDBACK RECORDS
            ================================================= */}

        <h2 className="sd-feedback-records-title">

          {staff
            ? "Patient Feedback Records"
            : "My Submitted Feedback"}

        </h2>

        {data.length === 0 ? (

          <div className="sd-feedback-empty">

            <div className="sd-feedback-empty-icon">
              💬
            </div>

            <h3>
              No Feedback Available
            </h3>

            <p>
              {staff
                ? "There are currently no patient feedback records to display."
                : "You have not submitted any feedback yet."}
            </p>

          </div>

        ) : (

          data.map(
            (item, index) => {

              const itemRating =
                Number(item.rating || 0);

              const patientName =
                item.patient?.fullName ||
                item.patientName ||
                item.user?.fullName ||
                item.user?.name ||
                "Patient";

              /*
               * Backend date field.
               *
               * Supports common field names in case your
               * Spring Boot entity/DTO uses one of them.
               */
              const createdDate =
                item.createdAt ||
                item.createdDate ||
                item.dateCreated ||
                item.timestamp;

              const formattedDate =
                formatSriLankaDateTime(
                  createdDate
                );

              return (

                <div
                  className="sd-feedback-record"
                  key={
                    item.id ||
                    `feedback-${index}`
                  }
                >

                  <div className="sd-feedback-record-top">

                    <span className="sd-feedback-patient-name">
                      {patientName}
                    </span>

                    <span className="sd-feedback-record-stars">
                      {renderStars(itemRating)}
                    </span>

                  </div>

                  <p className="sd-feedback-record-comment">
                    {item.comment}
                  </p>

                  {formattedDate && (

                    <small className="sd-feedback-record-date">

                      Submitted:{" "}
                      {formattedDate}

                    </small>

                  )}

                </div>

              );

            }
          )

        )}

      </main>

    </div>
  );
}