import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export function LegacyTodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    priority: "Medium",
  });

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // LOAD TODOS
  // ==========================================

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/todos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load todos."
        );
      }

      setTodos(data.todos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE TODO
  // ==========================================

  const createTodo = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/todos`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: form.title.trim(),
            subject: form.subject.trim(),
            priority: form.priority,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create task."
        );
      }

      const newTodo =
        data.todo ||
        data.data ||
        data;

      setTodos((current) => [
        newTodo,
        ...current,
      ]);

      setForm({
        title: "",
        subject: "",
        priority: "Medium",
      });

      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // COMPLETE / UNCOMPLETE
  // ==========================================

  const toggleTodo = async (todo) => {
    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/todos/${todo._id}/toggle`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update task."
        );
      }

      const updatedTodo =
        data.todo ||
        data.data ||
        data;

      setTodos((current) =>
        current.map((item) =>
          item._id === todo._id
            ? updatedTodo
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // DELETE TODO
  // ==========================================

  const deleteTodo = async (todo) => {
    const confirmed = window.confirm(
      `Delete "${todo.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/todos/${todo._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete task."
        );
      }

      setTodos((current) =>
        current.filter(
          (item) =>
            item._id !== todo._id
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // STATUS HELPER
  // ==========================================

  const isCompleted = (todo) => {
    return (
      todo.completed === true ||
      todo.isCompleted === true ||
      todo.status === "completed"
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="page-content todo-page">

      <div className="page-header">

        <div>
          <span className="page-eyebrow">
            STUDY PLANNER
          </span>

          <h1>Todo List</h1>

          <p>
            Things you need to get done.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm
            ? "Cancel"
            : "+ Create Task"}
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="todo-error">
          {error}
        </div>
      )}


      {/* CREATE FORM */}

      {showForm && (
        <form
          className="todo-create-form"
          onSubmit={createTodo}
        >

          <div className="form-group">
            <label htmlFor="todo-title">
              Task
            </label>

            <input
              id="todo-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task"
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="todo-subject">
              Subject
            </label>

            <input
              id="todo-subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. DAA"
            />
          </div>


          <div className="form-group">
            <label htmlFor="todo-priority">
              Priority
            </label>

            <select
              id="todo-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Creating..."
              : "Create Task"}
          </button>

        </form>
      )}


      {/* TODO LIST */}

      <section className="todo-card">

        <div className="todo-card-header">

          <div>
            <h2>Your Tasks</h2>

            <p>
              {todos.length}{" "}
              {todos.length === 1
                ? "task"
                : "tasks"}
            </p>
          </div>

        </div>


        {loading && (
          <div className="todo-message">
            Loading tasks...
          </div>
        )}


        {!loading &&
          todos.length === 0 && (
            <div className="todo-empty">
              <h3>
                Your todo list is empty.
              </h3>

              <p>
                Create your first task to get
                started.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setShowForm(true)
                }
              >
                + Create Task
              </button>
            </div>
          )}


        {!loading &&
          todos.length > 0 && (
            <div className="todo-items">

              {todos.map((todo) => {
                const completed =
                  isCompleted(todo);

                return (
                  <article
                    className={`todo-item ${
                      completed
                        ? "todo-item-completed"
                        : ""
                    }`}
                    key={todo._id}
                  >

                    <button
                      type="button"
                      className="todo-check"
                      onClick={() =>
                        toggleTodo(todo)
                      }
                      aria-label={
                        completed
                          ? "Mark incomplete"
                          : "Mark complete"
                      }
                    >
                      {completed
                        ? "✓"
                        : ""}
                    </button>


                    <div className="todo-item-content">

                      <h3>
                        {todo.title}
                      </h3>

                      <div className="todo-item-meta">

                        {todo.subject && (
                          <span>
                            {todo.subject}
                          </span>
                        )}

                        {todo.priority && (
                          <span
                            className={`todo-priority todo-priority-${String(
                              todo.priority
                            ).toLowerCase()}`}
                          >
                            {todo.priority}
                          </span>
                        )}

                      </div>

                    </div>


                    <div className="todo-item-actions">

                      <button
                        type="button"
                        className="todo-complete-button"
                        onClick={() =>
                          toggleTodo(todo)
                        }
                      >
                        {completed
                          ? "Undo"
                          : "Complete"}
                      </button>

                      <button
                        type="button"
                        className="todo-delete-button"
                        onClick={() =>
                          deleteTodo(todo)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </section>

    </main>
  );
}

const blankTask = { title: "", subject: "", priority: "Medium" };

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(blankTask);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to complete that request.");
    return data;
  };

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await api("/api/todos");
      setTodos(data.todos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTodos(); }, []);

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(blankTask);
  };

  const openCreate = () => {
    setError("");
    setEditing(null);
    setForm(blankTask);
    setShowForm(true);
  };

  const openEdit = (todo) => {
    setError("");
    setEditing(todo);
    setForm({ title: todo.title || "", subject: todo.subject || "", priority: todo.priority || "Medium" });
    setShowForm(true);
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return setError("Please enter a task title.");

    try {
      setSaving(true);
      setError("");
      const isEditing = Boolean(editing);
      const data = await api(isEditing ? `/api/todos/${editing._id}` : "/api/todos", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title.trim(), subject: form.subject.trim(), priority: form.priority }),
      });
      setTodos((items) => isEditing
        ? items.map((item) => item._id === data.todo._id ? data.todo : item)
        : [data.todo, ...items]);
      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (todo) => {
    try {
      setError("");
      const data = await api(`/api/todos/${todo._id}/toggle`, { method: "PATCH" });
      setTodos((items) => items.map((item) => item._id === todo._id ? data.todo : item));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (todo) => {
    if (!window.confirm(`Delete "${todo.title}"?`)) return;
    try {
      setError("");
      await api(`/api/todos/${todo._id}`, { method: "DELETE" });
      setTodos((items) => items.filter((item) => item._id !== todo._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="todos-page">
      <header className="todos-header">
        <div>
          <p className="small-heading">STUDY PLANNER</p>
          <h1>Todo List</h1>
          <p>Things you need to get done</p>
        </div>
        <button type="button" className="add-button" onClick={openCreate}>+ Create Task</button>
      </header>

      {error && <div className="todo-error" role="alert">{error}</div>}

      {showForm && (
        <form className="todo-form-card" onSubmit={save}>
          <div className="todo-form-header">
            <h2>{editing ? "Edit Task" : "Create Task"}</h2>
            <button type="button" className="todo-close-button" onClick={closeForm} aria-label="Close form">×</button>
          </div>
          <div className="todo-form-grid">
            <div className="todo-field">
              <label htmlFor="todo-title">Task</label>
              <input id="todo-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Complete DAA normalization" autoFocus required />
            </div>
            <div className="todo-field">
              <label htmlFor="todo-priority">Priority</label>
              <select id="todo-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>
          <div className="todo-field">
            <label htmlFor="todo-subject">Subject / Course</label>
            <input id="todo-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. DAA" />
          </div>
          <div className="todo-form-actions">
            <button type="button" className="todo-cancel-button" onClick={closeForm}>Cancel</button>
            <button type="submit" className="todo-save-button" disabled={saving}>{saving ? "Saving..." : editing ? "Save Changes" : "Create Task"}</button>
          </div>
        </form>
      )}

      {loading && <div className="todo-loading">Loading your tasks...</div>}
      {!loading && todos.length === 0 && (
        <div className="todo-empty">
          <h2>Your todo list is empty.</h2>
          <p>Add something you need to accomplish.</p>
          <button type="button" className="add-button" onClick={openCreate}>+ Create Task</button>
        </div>
      )}
      {!loading && todos.length > 0 && (
        <div className="todo-list">
          {todos.map((todo) => (
            <article className={`todo-item${todo.completed ? " completed" : ""}`} key={todo._id}>
              <button type="button" className={`todo-checkbox${todo.completed ? " checked" : ""}`} onClick={() => toggle(todo)} aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}>{todo.completed ? "✓" : ""}</button>
              <div className="todo-content">
                <div className="todo-title-row">
                  <h2>{todo.title}</h2>
                  <span className={`todo-priority ${String(todo.priority || "Medium").toLowerCase()}`}>{todo.priority || "Medium"}</span>
                </div>
                <p>{todo.subject || "No course selected"}</p>
              </div>
              <div className="todo-actions">
                <button type="button" className="todo-edit-button" onClick={() => openEdit(todo)}>Edit</button>
                <button type="button" className="todo-edit-button" onClick={() => toggle(todo)}>{todo.completed ? "Undo" : "Complete"}</button>
                <button type="button" className="todo-delete-button" onClick={() => remove(todo)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
