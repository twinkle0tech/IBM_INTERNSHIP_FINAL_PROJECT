import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

function ItemList() {
  // ========================================
  // STATE
  // ========================================

  const [schedules, setSchedules] = useState([]);
  const [todos, setTodos] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date()
  );

  const [now, setNow] = useState(() => new Date());

  // ========================================
  // AUTH / API HELPERS
  // ========================================

  const getToken = () => localStorage.getItem("token");

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const apiGet = async (endpoint) => {
    const token = getToken();

    if (!token) {
      throw new Error("Please log in again.");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load dashboard data."
      );
    }

    return data;
  };

  const apiPatch = async (endpoint, body) => {
    const token = getToken();

    if (!token) {
      throw new Error("Please log in again.");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to update the item."
      );
    }

    return data;
  };

  const apiDelete = async (endpoint) => {
    const token = getToken();

    if (!token) {
      throw new Error("Please log in again.");
    }

    const response = await fetch(API_URL + endpoint, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to delete the todo."
      );
    }

    return data;
  };

  // ========================================
  // DATE HELPERS
  // ========================================

  const getDateKey = (date) => {
    if (!date) return "";

    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date.slice(0, 10);
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "";
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getTodayDate = () => getDateKey(new Date());

  const formatDate = (date) => {
    if (!date) return "";

    const key = getDateKey(date);

    if (!key) return "";

    const value = new Date(`${key}T00:00:00`);

    return value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDueDate = (date) => {
    const key = getDateKey(date);

    if (!key) return "";

    const today = getTodayDate();

    const todayValue = new Date(`${today}T00:00:00`);
    const dueValue = new Date(`${key}T00:00:00`);

    const difference = Math.round(
      (dueValue - todayValue) / 86400000
    );

    if (difference === 0) return "Due today";
    if (difference === 1) return "Due tomorrow";
    if (difference === -1) return "Due yesterday";

    return `Due ${formatDate(key)}`;
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = String(time)
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute)
    ) {
      return time;
    }

    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes) => {
    const value = Number(minutes) || 0;

    if (value <= 0) return "0 min";

    const hours = Math.floor(value / 60);
    const remainingMinutes = value % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  };

  // ========================================
  // LOAD ALL DASHBOARD DATA
  // ========================================

  const loadDashboardData = async () => {
    const token = getToken();

    if (!token) {
      setSchedules([]);
      setTodos([]);
      setAssignments([]);
      setExams([]);
      setLoading(false);
      setError("Please log in to view your dashboard.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        scheduleData,
        todoData,
        assignmentData,
        examData,
      ] = await Promise.all([
        apiGet("/api/schedules"),
        apiGet("/api/todos"),
        apiGet("/api/assignments"),
        apiGet("/api/exams"),
      ]);

      setSchedules(
        Array.isArray(scheduleData.schedules)
          ? scheduleData.schedules
          : Array.isArray(scheduleData)
            ? scheduleData
            : []
      );

      setTodos(
        Array.isArray(todoData.todos)
          ? todoData.todos
          : Array.isArray(todoData)
            ? todoData
            : []
      );

      setAssignments(
        Array.isArray(assignmentData.assignments)
          ? assignmentData.assignments
          : Array.isArray(assignmentData)
            ? assignmentData
            : []
      );

      setExams(
        Array.isArray(examData.exams)
          ? examData.exams
          : Array.isArray(examData)
            ? examData
            : []
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(
        err.message || "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Keep countdowns current.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ========================================
  // TODAY'S DATA
  // ========================================

  const today = getTodayDate();

  const todaySchedules = useMemo(() => {
    return schedules
      .filter((item) => {
        const itemDate =
          item.date ||
          item.scheduledDate ||
          item.studyDate;

        return getDateKey(itemDate) === today;
      })
      .sort((a, b) => {
        const first = a.startTime || "00:00";
        const second = b.startTime || "00:00";

        return first.localeCompare(second);
      });
  }, [schedules, today]);

  const pendingTodos = useMemo(() => {
    return todos.filter(
      (todo) =>
        todo.completed !== true &&
        todo.status !== "completed" &&
        todo.status !== "done"
    );
  }, [todos]);

  // The dashboard priority card intentionally excludes Low priority tasks.
  // Keep the complete todo collection for the Todo List page itself.
  const dashboardPriorities = useMemo(() => {
    const priorityRank = { High: 0, Medium: 1 };

    return pendingTodos
      .filter((todo) => {
        const priority = String(todo.priority || "Medium");
        return priority === "High" || priority === "Medium";
      })
      .sort((first, second) => {
        const firstPriority = String(first.priority || "Medium");
        const secondPriority = String(second.priority || "Medium");
        return priorityRank[firstPriority] - priorityRank[secondPriority];
      });
  }, [pendingTodos]);

  const upcomingAssignments = useMemo(() => {
    return assignments
      .filter((assignment) => {
        const completed =
          assignment.completed === true ||
          assignment.status === "completed" ||
          assignment.status === "done";

        return !completed;
      })
      .sort((a, b) => {
        const first =
          getDateKey(
            a.dueDate ||
            a.deadline ||
            a.date
          ) || "9999-12-31";

        const second =
          getDateKey(
            b.dueDate ||
            b.deadline ||
            b.date
          ) || "9999-12-31";

        return first.localeCompare(second);
      })
      .slice(0, 5);
  }, [assignments]);

  const upcomingExams = useMemo(() => {
    return exams
      .filter((exam) => {
        const date =
          exam.date ||
          exam.examDate ||
          exam.deadline;

        const time = exam.time || "00:00";

        const target = new Date(
          `${getDateKey(date)}T${time}:00`
        );

        return (
          !Number.isNaN(target.getTime()) &&
          target.getTime() >= now.getTime()
        );
      })
      .sort((a, b) => {
        const first = new Date(
          `${getDateKey(
            a.date ||
            a.examDate ||
            a.deadline
          )}T${a.time || "00:00"}:00`
        );

        const second = new Date(
          `${getDateKey(
            b.date ||
            b.examDate ||
            b.deadline
          )}T${b.time || "00:00"}:00`
        );

        return first - second;
      });
  }, [exams, now]);

  const nextExam = upcomingExams[0] || null;

  // ========================================
  // EXAM COUNTDOWN
  // ========================================

  const examCountdown = useMemo(() => {
    if (!nextExam) return null;

    const examDate =
      nextExam.date ||
      nextExam.examDate ||
      nextExam.deadline;

    const examDateKey = getDateKey(examDate);

    if (!examDateKey) return null;

    const target = new Date(
      `${examDateKey}T${nextExam.time || "00:00"}:00`
    );

    const difference =
      target.getTime() - now.getTime();

    if (difference <= 0) return null;

    const totalMinutes = Math.floor(
      difference / 60000
    );

    return {
      days: Math.floor(totalMinutes / 1440),
      hours: Math.floor(
        (totalMinutes % 1440) / 60
      ),
      minutes: totalMinutes % 60,
    };
  }, [nextExam, now]);

  // ========================================
  // CALENDAR
  // ========================================

  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const cells = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(
        new Date(
          year,
          month,
          day
        )
      );
    }

    return cells;
  }, [calendarMonth]);

  const eventDates = useMemo(() => {
    const map = new Map();

    const addEvent = (date, type) => {
      const key = getDateKey(date);

      if (!key) return;

      if (!map.has(key)) {
        map.set(key, new Set());
      }

      map.get(key).add(type);
    };

    schedules.forEach((item) => {
      addEvent(
        item.date ||
        item.scheduledDate ||
        item.studyDate,
        "schedule"
      );
    });

    assignments.forEach((assignment) => {
      addEvent(
        assignment.dueDate ||
        assignment.deadline ||
        assignment.date,
        "assignment"
      );
    });

    exams.forEach((exam) => {
      addEvent(
        exam.date ||
        exam.examDate ||
        exam.deadline,
        "exam"
      );
    });

    return map;
  }, [schedules, assignments, exams]);

  const calendarTitle = calendarMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const goToSchedule = (dateKey) => {
    window.history.pushState(
      {},
      "",
      `/schedule?date=${dateKey}`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  const goToPage = (path) => {
    window.history.pushState(
      {},
      "",
      path
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  // ========================================
  // TODO TOGGLE
  // ========================================

  const handleToggleTodo = async (todo) => {
    try {
      setError("");

      const data = await apiPatch(
        `/api/todos/${todo._id}/toggle`
      );

      const updatedTodo =
        data.todo ||
        data;

      setTodos((currentTodos) =>
        currentTodos.map((item) =>
          item._id === todo._id
            ? updatedTodo
            : item
        )
      );
    } catch (err) {
      console.error("Todo toggle error:", err);

      setError(
        err.message ||
        "Unable to update todo."
      );
    }
  };

  const handleDeleteTodo = async (todo) => {
    if (!window.confirm("Delete \"" + todo.title + "\"?")) {
      return;
    }

    try {
      setError("");

      await apiDelete("/api/todos/" + todo._id);

      setTodos((currentTodos) =>
        currentTodos.filter(
          (item) => item._id !== todo._id
        )
      );
    } catch (err) {
      console.error("Todo delete error:", err);

      setError(
        err.message ||
        "Unable to delete todo."
      );
    }
  };

  // ========================================
// STUDY ACTIVITY
// Total duration of schedules for each day
// ========================================

const weeklyActivity = useMemo(() => {
  const days = [];

  const current = new Date();

  current.setHours(0, 0, 0, 0);

  // Find Monday of the current week
  const dayOfWeek = current.getDay();

  const mondayOffset =
    dayOfWeek === 0
      ? -6
      : 1 - dayOfWeek;

  const monday = new Date(current);

  monday.setDate(
    current.getDate() + mondayOffset
  );

  // Monday → Sunday
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(monday);

    date.setDate(
      monday.getDate() + index
    );

    const key = getDateKey(date);

    // Add the duration of EVERY schedule
    // created for this date.
    const minutes = schedules
      .filter((schedule) => {
        return getDateKey(schedule.date) === key;
      })
      .reduce((total, schedule) => {
        return (
          total +
          (Number(schedule.duration) || 0)
        );
      }, 0);

    days.push({
      label: date.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      ),

      date: key,

      minutes,
    });
  }

  return days;
}, [schedules]);

const totalWeeklyMinutes =
  weeklyActivity.reduce(
    (total, day) =>
      total + day.minutes,
    0
  );

const maxActivity =
  Math.max(
    ...weeklyActivity.map(
      (day) => day.minutes
    ),
    1
  );
  
  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="dashboard-content">
      {error && (
        <div className="home-dashboard-error">
          {error}
        </div>
      )}

      {/* ====================================
          TODAY'S SCHEDULE
      ==================================== */}

      <section
        className="schedule-section"
        id="schedule"
      >
        <div className="section-heading">
          <div>
            <h2>Today's Schedule</h2>
            <p>Your study plan for today</p>
          </div>

          <button
            type="button"
            className="add-button"
            onClick={() =>
              goToSchedule(today)
            }
          >
            + Add task
          </button>
        </div>

        {loading && (
          <div className="home-schedule-message">
            Loading today's schedule...
          </div>
        )}

        {!loading &&
          todaySchedules.length === 0 && (
            <div className="home-schedule-empty">
              <h3>No schedules for today.</h3>
              <p>
                Add a study session from the
                Schedule page.
              </p>
            </div>
          )}

        {!loading &&
          todaySchedules.length > 0 && (
            <div className="schedule-card">
              {todaySchedules.map((item) => (
                <div
                  className={
                    item.completed
                      ? "schedule-item completed"
                      : "schedule-item"
                  }
                  key={item._id}
                >
                  <div className="time">
                    {formatTime(
                      item.startTime
                    )}
                  </div>

                  <div className="schedule-line">
                    <div className="timeline-dot"></div>
                  </div>

                  <div className="schedule-info">
                    <h3>
                      {item.topic ||
                        item.title ||
                        "Study Session"}
                    </h3>

                    <p>
                      {item.subject || "Study"}
                    </p>
                  </div>

                  <span className="duration">
                    {formatDuration(
                      item.duration
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
      </section>

      {/* ====================================
          MAIN GRID
      ==================================== */}

      <div className="main-grid">
        {/* ==================================
            UPCOMING ASSIGNMENTS
        ================================== */}

        <section
          className="dashboard-card"
          id="assignments"
        >
          <div className="section-heading">
            <div>
              <h2>Upcoming Assignments</h2>
              <p>Don't miss your deadlines</p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                goToPage("/assignments")
              }
            >
              View all
            </button>
          </div>

          <div className="assignment-list">
            {loading && (
              <div className="home-dashboard-message">
                Loading assignments...
              </div>
            )}

            {!loading &&
              upcomingAssignments.length === 0 && (
                <div className="home-dashboard-message">
                  No pending assignments.
                </div>
              )}

            {!loading &&
              upcomingAssignments.map(
                (assignment) => {
                  const dueDate =
                    assignment.dueDate ||
                    assignment.deadline ||
                    assignment.date;

                  return (
                    <div
                      className="assignment-item"
                      key={assignment._id}
                    >
                      <div className="assignment-icon">
                        ✓
                      </div>

                      <div className="assignment-info">
                        <h3>
                          {assignment.title ||
                            assignment.name ||
                            "Assignment"}
                        </h3>

                        <p>
                          {assignment.subject ||
                            assignment.course ||
                            "Study"}
                        </p>
                      </div>

                      <span className="due-date">
                        {formatDueDate(dueDate)}
                      </span>
                    </div>
                  );
                }
              )}
          </div>
        </section>

        {/* ==================================
            TOP PRIORITIES
        ================================== */}

        <section
          className="dashboard-card"
          id="priorities"
        >
          <div className="section-heading">
            <div>
              <h2>Top Priorities</h2>
              <p>Focus on these tasks</p>
            </div>
          </div>

          <div className="priority-list">
            {loading && (
              <div className="home-dashboard-message">
                Loading priorities...
              </div>
            )}

            {!loading &&
              dashboardPriorities.length === 0 && (
                <div className="home-dashboard-message">
                  You have no pending priorities.
                </div>
              )}

            {!loading &&
              dashboardPriorities
                .slice(0, 5)
                .map((todo) => (
                  <label
                    className="priority-item"
                    key={todo._id}
                  >
                    <input
                      type="checkbox"
                      checked={
                        todo.completed === true
                      }
                      onChange={() =>
                        handleToggleTodo(todo)
                      }
                    />

                    <span>
                      {todo.title ||
                        todo.text ||
                        todo.name ||
                        "Todo"}
                    </span>
                  </label>
                ))}
          </div>
        </section>

        {/* ==================================
            CALENDAR
        ================================== */}

        <section className="dashboard-card calendar-card">
          <div className="section-heading">
            <div>
              <h2>{calendarTitle}</h2>
              <p>Your study calendar</p>
            </div>

            <div className="calendar-arrows">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setCalendarMonth(
                    (date) =>
                      new Date(
                        date.getFullYear(),
                        date.getMonth() - 1,
                        1
                      )
                  )
                }
              >
                ‹
              </button>

              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setCalendarMonth(
                    (date) =>
                      new Date(
                        date.getFullYear(),
                        date.getMonth() + 1,
                        1
                      )
                  )
                }
              >
                ›
              </button>
            </div>
          </div>

          <div className="calendar">
            <div className="calendar-header">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="calendar-days">
              {calendarData.map(
                (date, index) => {
                  if (!date) {
                    return (
                      <span
                        className="empty"
                        key={`empty-${index}`}
                      />
                    );
                  }

                  const key =
                    getDateKey(date);

                  const events =
                    eventDates.get(key);

                  const isToday =
                    key === today;

                  const hasTask =
                    events &&
                    events.size > 0;

                  return (
                    <button
                      type="button"
                      key={key}
                      className={[
                        "calendar-day",
                        isToday
                          ? "today"
                          : "",
                        hasTask
                          ? "has-task"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() =>
                        goToSchedule(key)
                      }
                      title={
                        hasTask
                          ? Array.from(
                              events
                            ).join(", ")
                          : "Open schedule"
                      }
                    >
                      {date.getDate()}

                      {hasTask && (
                        <span className="calendar-dot">
                          •
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="calendar-legend">
            <span>
              <i className="calendar-legend-dot" />
              Study activity
            </span>
          </div>
        </section>

        {/* ==================================
            TODO LIST
        ================================== */}

        <section
          className="dashboard-card"
          id="todos"
        >
          <div className="section-heading">
            <div>
              <h2>Todo List</h2>
              <p>Things you need to get done</p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                goToPage("/todos")
              }
            >
              View all
            </button>
          </div>

          <div className="todo-list">
            {loading && (
              <div className="home-todo-message">
                Loading todo list...
              </div>
            )}

            {!loading &&
              todos.length === 0 && (
                <div className="home-todo-empty">
                  <h3>
                    Your todo list is empty.
                  </h3>
                  <p>
                    Add something you need
                    to accomplish.
                  </p>
                </div>
              )}

            {!loading &&
              todos
                .map((todo) => (
                  <article
                    className={
                      todo.completed
                        ? "todo-item completed"
                        : "todo-item"
                    }
                    key={todo._id}
                  >
                    <button
                      type="button"
                      className={
                        todo.completed === true
                          ? "todo-checkbox checked"
                          : "todo-checkbox"
                      }
                      onClick={() =>
                        handleToggleTodo(todo)
                      }
                      aria-label={
                        todo.completed
                          ? "Mark incomplete"
                          : "Mark complete"
                      }
                    >
                      {todo.completed ? "✓" : ""}
                    </button>

                    <div className="todo-content">
                      <div className="todo-title-row">
                        <h2>
                          {todo.title ||
                            todo.text ||
                            todo.name ||
                            "Todo"}
                        </h2>

                        <span
                          className={
                            "todo-priority " +
                            String(
                              todo.priority || "Medium"
                            ).toLowerCase()
                          }
                        >
                          {todo.priority || "Medium"}
                        </span>
                      </div>

                      <p>
                        {todo.subject ||
                          todo.course ||
                          "No course selected"}
                      </p>
                    </div>

                    <div className="todo-actions">
                      <button
                        type="button"
                        className="todo-edit-button"
                        onClick={() =>
                          handleToggleTodo(todo)
                        }
                      >
                        {todo.completed
                          ? "Undo"
                          : "Complete"}
                      </button>

                      <button
                        type="button"
                        className="todo-delete-button"
                        onClick={() =>
                          handleDeleteTodo(todo)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        {/* ==================================
            EXAM COUNTDOWN
        ================================== */}

        <section
          className="dashboard-card exam-card"
          id="exams"
        >
          <div className="section-heading">
            <div>
              <h2>Exam Countdown</h2>

              <p>
                {nextExam
                  ? nextExam.title ||
                    nextExam.name ||
                    "Upcoming Exam"
                  : "No upcoming exams"}
              </p>
            </div>

            <span className="exam-icon">
              !
            </span>
          </div>

          {loading && (
            <div className="home-dashboard-message">
              Loading exams...
            </div>
          )}

          {!loading && !nextExam && (
            <div className="home-dashboard-message">
              <p>
                You have no upcoming exams.
              </p>

              <button
                type="button"
                className="text-button"
                onClick={() =>
                  goToPage("/exams")
                }
              >
                Add an exam
              </button>
            </div>
          )}

          {!loading &&
            nextExam &&
            examCountdown && (
              <>
                <div className="exam-next-info">
                  <strong>
                    {nextExam.subject ||
                      "Exam"}
                  </strong>

                  <span>
                    {formatDate(
                      nextExam.date ||
                        nextExam.examDate ||
                        nextExam.deadline
                    )}

                    {nextExam.time
                      ? ` • ${formatTime(
                          nextExam.time
                        )}`
                      : ""}
                  </span>
                </div>

                <div className="countdown">
                  <div>
                    <strong>
                      {String(
                        examCountdown.days
                      ).padStart(2, "0")}
                    </strong>

                    <span>Days</span>
                  </div>

                  <div>
                    <strong>
                      {String(
                        examCountdown.hours
                      ).padStart(2, "0")}
                    </strong>

                    <span>Hours</span>
                  </div>

                  <div>
                    <strong>
                      {String(
                        examCountdown.minutes
                      ).padStart(2, "0")}
                    </strong>

                    <span>Minutes</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="study-button"
                  onClick={() =>
                    goToPage("/exams")
                  }
                >
                  View exam
                </button>
              </>
            )}
        </section>

        {/* ==================================
            ACTIVITY
        ================================== */}

        <section
          className="dashboard-card activity-card"
        >
          <div className="section-heading">
            <div>
              <h2>Study Activity</h2>
              <p>Your activity this week</p>
            </div>

            <span className="activity-number">
              {formatDuration(
                totalWeeklyMinutes
              )}
            </span>
          </div>

          <div className="activity-chart">
            {weeklyActivity.map((day) => {
              const height =
                day.minutes === 0
                  ? 0
                  : Math.max(
                      8,
                      Math.round(
                        (day.minutes /
                          maxActivity) *
                          100
                      )
                    );

              return (
                <div
                  className="bar"
                  key={day.date}
                  title={`${day.label}: ${formatDuration(
                    day.minutes
                  )}`}
                >
                  <div
                    className="activity-bar-fill"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <span>{day.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ItemList;
