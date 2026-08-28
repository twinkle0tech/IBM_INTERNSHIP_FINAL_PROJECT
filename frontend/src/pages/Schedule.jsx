import { useEffect, useState } from "react";

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL;
=======
const API_URL = "https://ibm-internship-final-project-2.onrender.com";
>>>>>>> 554a8616535eb4b74d9db65d7043edbf1e2cf219


function Schedule() {

  // ========================================
  // STATE
  // ========================================

  const [schedules, setSchedules] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // Selected date
  const [selectedDate, setSelectedDate] =
    useState(() => {

      const today = new Date();

      return today
        .toISOString()
        .split("T")[0];
    });


  // Form
  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [topic, setTopic] =
    useState("");

  const [date, setDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [description, setDescription] =
    useState("");


  // ========================================
  // TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // ========================================
  // API REQUEST
  // ========================================

  const apiRequest = async (
    url,
    options = {}
  ) => {

    const token = getToken();


    if (!token) {

      throw new Error(
        "Your session has expired. Please log in again."
      );
    }


    const response =
      await fetch(
        `${API_URL}${url}`,
        {
          ...options,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

            ...(options.headers || {})
          }
        }
      );


    const data =
      await response.json();


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


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Something went wrong."
      );
    }


    return data;
  };


  // ========================================
  // LOAD SCHEDULES
  // ========================================

  const loadSchedules = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await apiRequest(
          "/api/schedules"
        );


      setSchedules(
        data.schedules || []
      );

    } catch (error) {

      console.error(
        "Load schedules error:",
        error
      );

      setError(
        error.message ||
        "Unable to load schedules."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    loadSchedules();

  }, []);


  // ========================================
  // SUCCESS MESSAGE
  // ========================================

  const showSuccessMessage = (
    message
  ) => {

    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };


  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {

    setEditingId(null);

    setTitle("");

    setSubject("");

    setTopic("");

    setDate(selectedDate);

    setStartTime("");

    setEndTime("");

    setDescription("");

    setShowForm(false);
  };


  // ========================================
  // OPEN ADD
  // ========================================

  const openAddForm = () => {

    setEditingId(null);

    setTitle("");

    setSubject("");

    setTopic("");

    setDate(selectedDate);

    setStartTime("");

    setEndTime("");

    setDescription("");

    setError("");

    setShowForm(true);
  };


  // ========================================
  // OPEN EDIT
  // ========================================

  const openEditForm = (
    schedule
  ) => {

    setEditingId(
      schedule._id
    );

    setTitle(
      schedule.title
    );

    setSubject(
      schedule.subject
    );

    setTopic(
      schedule.topic || ""
    );

    setDate(
      schedule.date
    );

    setStartTime(
      schedule.startTime
    );

    setEndTime(
      schedule.endTime
    );

    setDescription(
      schedule.description || ""
    );

    setError("");

    setShowForm(true);
  };


  // ========================================
  // SAVE
  // ========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (
      !title.trim() ||
      !subject.trim() ||
      !date ||
      !startTime ||
      !endTime
    ) {

      setError(
        "Please fill all required fields."
      );

      return;
    }


    if (startTime >= endTime) {

      setError(
        "End time must be after start time."
      );

      return;
    }


    try {

      const isEditing =
        Boolean(editingId);


      const url = isEditing
        ? `/api/schedules/${editingId}`
        : "/api/schedules";


      const method = isEditing
        ? "PUT"
        : "POST";


      const data =
        await apiRequest(
          url,
          {
            method,

            body: JSON.stringify({

              title:
                title.trim(),

              subject:
                subject.trim(),

              topic:
                topic.trim(),

              date,

              startTime,

              endTime,

              description:
                description.trim()
            })
          }
        );


      if (isEditing) {

        setSchedules(
          (current) =>
            current.map(
              (item) =>
                item._id === editingId
                  ? data.schedule
                  : item
            )
        );


        showSuccessMessage(
          "Schedule updated successfully."
        );

      } else {

        setSchedules(
          (current) => [
            ...current,
            data.schedule
          ]
        );


        showSuccessMessage(
          "Schedule added successfully."
        );
      }


      resetForm();

    } catch (error) {

      console.error(
        "Save schedule error:",
        error
      );

      setError(
        error.message ||
        "Unable to save schedule."
      );
    }
  };


  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (
    schedule
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${schedule.title}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");


      await apiRequest(
        `/api/schedules/${schedule._id}`,
        {
          method: "DELETE"
        }
      );


      setSchedules(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              schedule._id
          )
      );


      showSuccessMessage(
        "Schedule deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete schedule error:",
        error
      );

      setError(
        error.message ||
        "Unable to delete schedule."
      );
    }
  };


  // ========================================
  // TOGGLE
  // ========================================

  const handleToggle = async (
    schedule
  ) => {

    try {

      setError("");


      const data =
        await apiRequest(
          `/api/schedules/${schedule._id}/toggle`,
          {
            method: "PATCH"
          }
        );


      setSchedules(
        (current) =>
          current.map(
            (item) =>
              item._id === schedule._id
                ? data.schedule
                : item
          )
      );

    } catch (error) {

      console.error(
        "Toggle schedule error:",
        error
      );

      setError(
        error.message ||
        "Unable to update schedule."
      );
    }
  };


  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (
    dateValue
  ) => {

    if (!dateValue) {
      return "";
    }


    return new Date(
      `${dateValue}T00:00:00`
    ).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric"
      }
    );
  };


  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (
    time
  ) => {

    if (!time) {
      return "";
    }


    const [
      hour,
      minute
    ] = time
      .split(":")
      .map(Number);


    const date =
      new Date();

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
        minute: "2-digit"
      }
    );
  };


  // ========================================
  // FORMAT DURATION
  // ========================================

  const formatDuration = (
    minutes
  ) => {

    if (!minutes) {
      return "0 min";
    }


    const hours =
      Math.floor(
        minutes / 60
      );

    const remainingMinutes =
      minutes % 60;


    if (hours === 0) {

      return `${remainingMinutes} min`;
    }


    if (remainingMinutes === 0) {

      return `${hours} hr`;
    }


    return `${hours} hr ${remainingMinutes} min`;
  };


  // ========================================
  // DATE FILTER
  // ========================================

  const filteredSchedules =
    schedules.filter(
      (schedule) =>
        schedule.date ===
        selectedDate
    );


  // ========================================
  // UPCOMING
  // ========================================

  const upcomingSchedules =
    schedules
      .filter(
        (schedule) =>
          schedule.date >
          selectedDate
      )
      .slice(0, 5);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <section className="schedule-page">

        <div className="schedule-header">

          <div>

            <p className="small-heading">
              STUDY PLANNER
            </p>

            <h1>
              Schedule
            </h1>

            <p>
              Plan your study time and stay consistent.
            </p>

          </div>

        </div>


        <div className="schedule-loading">
          Loading...
        </div>

      </section>

    );
  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <section className="schedule-page">


      {/* HEADER */}

      <div className="schedule-header">

        <div>

          <p className="small-heading">
            STUDY PLANNER
          </p>

          <h1>
            Schedule
          </h1>

          <p>
            Plan your study time and stay consistent.
          </p>

        </div>


        <button
          type="button"
          className="add-button"
          onClick={openAddForm}
        >
          + Add Schedule
        </button>

      </div>


      {/* MESSAGES */}

      {error && (

        <div className="schedule-error">
          {error}
        </div>

      )}


      {success && (

        <div className="schedule-success">
          {success}
        </div>

      )}


      {/* DATE SELECTOR */}

      <div className="schedule-date-card">

        <div>

          <label>
            Select Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(
                event.target.value
              )
            }
          />

        </div>


        <div className="selected-date-text">

          <span>
            Selected day
          </span>

          <strong>
            {formatDate(
              selectedDate
            )}
          </strong>

        </div>

      </div>


      {/* FORM */}

      {showForm && (

        <div className="form-card">

          <div className="form-card-header">

            <h2>
              {editingId
                ? "Edit Schedule"
                : "Add Schedule"}
            </h2>

            <button
              type="button"
              className="close-button"
              onClick={resetForm}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
          >

            <div className="schedule-form-grid">

              <div>

                <label>
                  Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Study Binary Trees"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={subject}
                  onChange={(event) =>
                    setSubject(
                      event.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  Topic
                </label>

                <input
                  type="text"
                  placeholder="e.g. Binary Trees"
                  value={topic}
                  onChange={(event) =>
                    setTopic(
                      event.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(
                      event.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            <label>
              Description
            </label>

            <textarea
              placeholder="What do you plan to study?"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows="4"
            />


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingId
                  ? "Update Schedule"
                  : "Save Schedule"}
              </button>

            </div>

          </form>

        </div>

      )}


      {/* TODAY */}

      <div className="schedule-section">

        <div className="schedule-section-heading">

          <div>

            <h2>
              Today's Schedule
            </h2>

            <p>
              {formatDate(
                selectedDate
              )}
            </p>

          </div>

        </div>


        {filteredSchedules.length === 0 ? (

          <div className="schedule-empty">

            <h3>
              No schedule for this date.
            </h3>

            <p>
              Add a study session to organize your day.
            </p>

            <button
              type="button"
              className="add-button"
              onClick={openAddForm}
            >
              + Add Schedule
            </button>

          </div>

        ) : (

          <div className="schedule-list">

            {filteredSchedules.map(
              (schedule) => (

                <article
                  className={
                    schedule.completed
                      ? "schedule-card completed"
                      : "schedule-card"
                  }
                  key={
                    schedule._id
                  }
                >

                  {/* TIME */}

                  <div className="schedule-time">

                    <strong>
                      {formatTime(
                        schedule.startTime
                      )}
                    </strong>

                    <span>
                      {formatTime(
                        schedule.endTime
                      )}
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="schedule-details">

                    <div className="schedule-title-row">

                      <h3>
                        {schedule.title}
                      </h3>

                      {schedule.completed && (

                        <span className="completed-badge">
                          Completed
                        </span>

                      )}

                    </div>


                    <p className="schedule-subject">
                      {schedule.subject}

                      {schedule.topic &&
                        ` • ${schedule.topic}`}
                    </p>


                    {schedule.description && (

                      <p className="schedule-description">
                        {
                          schedule.description
                        }
                      </p>

                    )}


                    <span className="schedule-duration">
                      {formatDuration(
                        schedule.duration
                      )}
                    </span>

                  </div>


                  {/* ACTIONS */}

                  <div className="schedule-actions">

                    <button
                      type="button"
                      className="complete-button"
                      onClick={() =>
                        handleToggle(
                          schedule
                        )
                      }
                    >
                      {schedule.completed
                        ? "Mark Incomplete"
                        : "Complete"}
                    </button>


                    <button
                      type="button"
                      className="text-button"
                      onClick={() =>
                        openEditForm(
                          schedule
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="danger-text-button"
                      onClick={() =>
                        handleDelete(
                          schedule
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </div>


      {/* UPCOMING */}

      <div className="schedule-section">

        <div className="schedule-section-heading">

          <div>

            <h2>
              Upcoming Schedule
            </h2>

            <p>
              Your next study sessions
            </p>

          </div>

        </div>


        {upcomingSchedules.length === 0 ? (

          <div className="schedule-empty small">

            No upcoming schedules.

          </div>

        ) : (

          <div className="upcoming-list">

            {upcomingSchedules.map(
              (schedule) => (

                <div
                  className="upcoming-card"
                  key={
                    schedule._id
                  }
                >

                  <div>

                    <strong>
                      {formatDate(
                        schedule.date
                      )}
                    </strong>

                    <h3>
                      {schedule.title}
                    </h3>

                    <p>
                      {schedule.subject}
                      {schedule.topic &&
                        ` • ${schedule.topic}`}
                    </p>

                  </div>


                  <span>
                    {formatTime(
                      schedule.startTime
                    )}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
}


export default Schedule;
