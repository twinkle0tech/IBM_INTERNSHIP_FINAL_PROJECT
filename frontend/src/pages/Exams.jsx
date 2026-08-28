import { useEffect, useMemo, useState } from "react";

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL;
=======
const API_URL = "https://ibm-internship-final-project-2.onrender.com";
>>>>>>> 554a8616535eb4b74d9db65d7043edbf1e2cf219

const EMPTY_FORM = {
  title: "",
  subject: "",
  date: "",
  time: "",
  location: "",
  status: "Not Started",
  notes: "",
};

const getExamDate = (exam) => {
  if (!exam?.date) {
    return new Date(NaN);
  }

  return new Date(
    `${exam.date}T${exam.time || "00:00"}:00`
  );
};

const formatDate = (date) => {
  if (!date) return "";

  const value = new Date(`${date}T00:00:00`);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (date) => {
  if (!date) {
    return {
      day: "",
      month: "",
    };
  }

  const value = new Date(`${date}T00:00:00`);

  return {
    day: value
      .getDate()
      .toString()
      .padStart(2, "0"),

    month: value.toLocaleDateString(
      "en-US",
      {
        month: "short",
      }
    ),
  };
};

const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time
    .split(":")
    .map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return time;
  }

  const date = new Date();

  date.setHours(
    hour,
    minute,
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};

const getCountdown = (exam, now) => {
  if (!exam) return null;

  const target =
    getExamDate(exam).getTime();

  if (!Number.isFinite(target)) {
    return null;
  }

  const difference =
    target - now;

  if (difference <= 0) {
    return null;
  }

  const totalMinutes =
    Math.floor(
      difference / 60000
    );

  return {
    days:
      Math.floor(
        totalMinutes / 1440
      ),

    hours:
      Math.floor(
        (totalMinutes % 1440) / 60
      ),

    minutes:
      totalMinutes % 60,
  };
};

function Exams() {
  const [exams, setExams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [now, setNow] =
    useState(Date.now());

  // ========================================
  // API
  // ========================================

  const apiRequest = async (
    endpoint,
    options = {}
  ) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Please log in again."
      );
    }

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          ...(options.body
            ? {
                "Content-Type":
                  "application/json",
              }
            : {}),

          Authorization:
            `Bearer ${token}`,

          ...(options.headers || {}),
        },
      }
    );

    if (response.status === 401) {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Something went wrong."
      );
    }

    return data;
  };

  // ========================================
  // LOAD EXAMS
  // ========================================

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await apiRequest(
          "/api/exams"
        );

      setExams(
        Array.isArray(data.exams)
          ? data.exams
          : Array.isArray(data)
            ? data
            : []
      );
    } catch (err) {
      console.error(
        "Load exams error:",
        err
      );

      setError(
        err.message ||
        "Unable to load exams."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  // ========================================
  // COUNTDOWN REFRESH
  // ========================================

  useEffect(() => {
    const timer =
      setInterval(() => {
        setNow(Date.now());
      }, 30000);

    return () =>
      clearInterval(timer);
  }, []);

  // ========================================
  // UPCOMING EXAMS
  // ========================================

  const upcomingExams =
    useMemo(() => {
      return exams
        .filter((exam) => {
          const date =
            getExamDate(exam);

          return (
            !Number.isNaN(
              date.getTime()
            ) &&
            date.getTime() >= now
          );
        })
        .sort(
          (a, b) =>
            getExamDate(a) -
            getExamDate(b)
        );
    }, [exams, now]);

  const nextExam =
    upcomingExams[0] || null;

  // ========================================
  // STATS
  // ========================================

  const readyCount =
    exams.filter(
      (exam) =>
        exam.status === "Ready"
    ).length;

  const inProgressCount =
    exams.filter(
      (exam) =>
        exam.status ===
        "In Progress"
    ).length;

  const countdown =
    getCountdown(
      nextExam,
      now
    );

  // ========================================
  // FORM
  // ========================================

  const openAddForm = () => {
    setEditingId(null);

    setForm(
      EMPTY_FORM
    );

    setError("");

    setShowForm(true);
  };

  const openEditForm = (exam) => {
    setEditingId(
      exam._id
    );

    setForm({
      title:
        exam.title || "",

      subject:
        exam.subject || "",

      date:
        exam.date || "",

      time:
        exam.time || "",

      location:
        exam.location || "",

      status:
        exam.status ||
        "Not Started",

      notes:
        exam.notes || "",
    });

    setError("");

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm(
      EMPTY_FORM
    );
  };

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };

  // ========================================
  // CREATE / UPDATE
  // ========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.date
    ) {
      setError(
        "Exam title, subject and date are required."
      );

      return;
    }

    try {
      const isEditing =
        Boolean(editingId);

      const data =
        await apiRequest(
          isEditing
            ? `/api/exams/${editingId}`
            : "/api/exams",
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            body:
              JSON.stringify({
                title:
                  form.title.trim(),

                subject:
                  form.subject.trim(),

                date:
                  form.date,

                time:
                  form.time ||
                  "00:00",

                location:
                  form.location.trim(),

                status:
                  form.status,

                notes:
                  form.notes.trim(),
              }),
          }
        );

      if (isEditing) {
        setExams(
          (current) =>
            current.map(
              (exam) =>
                exam._id ===
                editingId
                  ? data.exam
                  : exam
            )
        );

        setSuccess(
          "Exam updated successfully."
        );
      } else {
        setExams(
          (current) => [
            ...current,
            data.exam,
          ]
        );

        setSuccess(
          "Exam added successfully."
        );
      }

      closeForm();

      setTimeout(
        () => setSuccess(""),
        2500
      );
    } catch (err) {
      console.error(
        "Save exam error:",
        err
      );

      setError(
        err.message ||
        "Unable to save exam."
      );
    }
  };

  // ========================================
  // DELETE
  // ========================================

  const deleteExam = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this exam?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiRequest(
        `/api/exams/${id}`,
        {
          method: "DELETE",
        }
      );

      setExams(
        (current) =>
          current.filter(
            (exam) =>
              exam._id !== id
          )
      );

      setSuccess(
        "Exam deleted successfully."
      );

      setTimeout(
        () => setSuccess(""),
        2500
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to delete exam."
      );
    }
  };

  // ========================================
  // STATUS
  // ========================================

  const updateStatus = async (
    exam,
    status
  ) => {
    try {
      setError("");

      const data =
        await apiRequest(
          `/api/exams/${exam._id}/status`,
          {
            method: "PATCH",

            body:
              JSON.stringify({
                status,
              }),
          }
        );

      setExams(
        (current) =>
          current.map(
            (item) =>
              item._id ===
              exam._id
                ? data.exam
                : item
          )
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to update exam status."
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="exams-page">
        <div className="exam-loading">
          Loading exams...
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="exams-page">

      {/* HEADER */}

      <header className="exams-header">
        <div>
          <p className="small-heading">
            STUDY PLANNER
          </p>

          <h1>Exams</h1>

          <p>
            Manage your upcoming exams
            and preparation progress.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={openAddForm}
        >
          + Add Exam
        </button>
      </header>


      {/* MESSAGES */}

      {error && (
        <div className="exam-error">
          {error}
        </div>
      )}

      {success && (
        <div className="exam-success">
          {success}
        </div>
      )}


      {/* ADD / EDIT FORM */}

      {showForm && (
        <section className="exam-form-card">

          <div className="form-card-header">
            <h2>
              {editingId
                ? "Edit Exam"
                : "Add Exam"}
            </h2>

            <button
              type="button"
              className="close-button"
              onClick={closeForm}
            >
              ×
            </button>
          </div>


          <form onSubmit={handleSubmit}>

            <div className="exam-form-grid">

              <div>
                <label htmlFor="exam-title">
                  Exam Title
                </label>

                <input
                  id="exam-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. MERN Final"
                />
              </div>


              <div>
                <label htmlFor="exam-subject">
                  Subject
                </label>

                <input
                  id="exam-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. DAA"
                />
              </div>


              <div>
                <label htmlFor="exam-date">
                  Exam Date
                </label>

                <input
                  id="exam-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>


              <div>
                <label htmlFor="exam-time">
                  Exam Time
                </label>

                <input
                  id="exam-time"
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />
              </div>


              <div>
                <label htmlFor="exam-location">
                  Location
                </label>

                <input
                  id="exam-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Room 204"
                />
              </div>


              <div>
                <label htmlFor="exam-status">
                  Preparation Status
                </label>

                <select
                  id="exam-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>
                    Not Started
                  </option>

                  <option>
                    In Progress
                  </option>

                  <option>
                    Ready
                  </option>
                </select>
              </div>

            </div>


            <div>
              <label htmlFor="exam-notes">
                Notes
              </label>

              <textarea
                id="exam-notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add important topics or notes..."
              />
            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingId
                  ? "Save Changes"
                  : "Add Exam"}
              </button>

            </div>

          </form>
        </section>
      )}


      {/* NEXT EXAM */}

      {nextExam && countdown && (
        <section className="exam-countdown-card">

          <div>
            <p className="small-heading">
              NEXT EXAM
            </p>

            <h2>
              {nextExam.title}
            </h2>

            <p>
              {nextExam.subject}
              {" • "}
              {formatDate(
                nextExam.date
              )}
              {nextExam.time
                ? ` • ${formatTime(
                    nextExam.time
                  )}`
                : ""}
            </p>
          </div>


          <div className="exam-countdown">

            <div>
              <strong>
                {String(
                  countdown.days
                ).padStart(2, "0")}
              </strong>

              <span>
                Days
              </span>
            </div>


            <div>
              <strong>
                {String(
                  countdown.hours
                ).padStart(2, "0")}
              </strong>

              <span>
                Hours
              </span>
            </div>


            <div>
              <strong>
                {String(
                  countdown.minutes
                ).padStart(2, "0")}
              </strong>

              <span>
                Minutes
              </span>
            </div>

          </div>

        </section>
      )}


      {/* STATISTICS */}

      <section className="exam-stats">

        <div className="exam-stat">
          <span>
            Total Exams
          </span>

          <strong>
            {exams.length}
          </strong>
        </div>


        <div className="exam-stat">
          <span>
            Upcoming
          </span>

          <strong>
            {upcomingExams.length}
          </strong>
        </div>


        <div className="exam-stat">
          <span>
            Ready
          </span>

          <strong>
            {readyCount}
          </strong>
        </div>

      </section>


      {/* EXAMS */}

      <section className="exam-list">

        {exams.length === 0 ? (

          <div className="exam-empty">

            <h2>
              No exams yet
            </h2>

            <p>
              Add your first exam to
              start tracking your
              preparation.
            </p>

            <button
              type="button"
              className="add-button"
              onClick={openAddForm}
            >
              + Add Exam
            </button>

          </div>

        ) : (

          exams
            .slice()
            .sort(
              (a, b) =>
                getExamDate(a) -
                getExamDate(b)
            )
            .map((exam) => {

              const dateInfo =
                formatShortDate(
                  exam.date
                );

              const examDate =
                getExamDate(exam);

              const isPast =
                examDate.getTime() <
                now;

              let statusClass =
                "status-not-started";

              if (
                exam.status ===
                "In Progress"
              ) {
                statusClass =
                  "status-in-progress";
              }

              if (
                exam.status ===
                "Ready"
              ) {
                statusClass =
                  "status-ready";
              }

              return (
                <article
                  className={
                    isPast
                      ? "exam-item past"
                      : "exam-item"
                  }
                  key={exam._id}
                >

                  {/* DATE */}

                  <div className="exam-date-box">

                    <strong>
                      {dateInfo.day}
                    </strong>

                    <span>
                      {dateInfo.month}
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="exam-details">

                    <div className="exam-title-row">

                      <h2>
                        {exam.title}
                      </h2>

                      <span
                        className={`exam-status ${statusClass}`}
                      >
                        {exam.status ||
                          "Not Started"}
                      </span>

                    </div>


                    <p>
                      {exam.subject}
                      {" • "}
                      {formatDate(
                        exam.date
                      )}

                      {exam.time &&
                        ` • ${formatTime(
                          exam.time
                        )}`}
                    </p>


                    {exam.location && (
                      <small>
                        Location:{" "}
                        {exam.location}
                      </small>
                    )}


                    {exam.notes && (
                      <small>
                        {exam.notes}
                      </small>
                    )}

                  </div>


                  {/* ACTIONS */}

                  <div className="exam-actions">

                    <select
                      value={
                        exam.status ||
                        "Not Started"
                      }
                      onChange={(event) =>
                        updateStatus(
                          exam,
                          event.target.value
                        )
                      }
                      aria-label={`Status for ${exam.title}`}
                    >
                      <option>
                        Not Started
                      </option>

                      <option>
                        In Progress
                      </option>

                      <option>
                        Ready
                      </option>
                    </select>


                    <button
                      type="button"
                      className="text-button"
                      onClick={() =>
                        openEditForm(
                          exam
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="danger-text-button"
                      onClick={() =>
                        deleteExam(
                          exam._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              );
            })
        )}

      </section>

    </div>
  );
}

export default Exams;
