import React, { useState } from "react";
import "./TodoPage.css";

/**
 * Button and UI for suggesting a task using the OpenAI API.
 * Props:
 *   onAcceptSuggestion(suggestion: {title, details}): Accepts and adds the suggested task.
 */
function SuggestTaskButton({ onAccept }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  async function fetchSuggestion() {
    setLoading(true);
    setError(null);

    // Set up OpenAI call via fetch for browser compatibility.
    // Show friendly prompt for a productivity todo suggestion.
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      setError("Missing API key.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant providing smart, concise, practical to-do task suggestions for personal productivity applications. Respond with only one actionable task, suitable to add directly to a user's todo list.",
            },
            {
              role: "user",
              content:
                "Suggest one productive task for my todo list. Respond only with a task title and its details as JSON {\"title\": ..., \"details\": ...}.",
            },
          ],
          max_tokens: 64,
          n: 1,
        }),
      });
      const data = await res.json();

      let aiText = "";
      if (
        data &&
        data.choices &&
        data.choices.length > 0 &&
        data.choices[0].message &&
        data.choices[0].message.content
      ) {
        aiText = data.choices[0].message.content.trim();
      } else {
        setError("API did not return a suggestion.");
        setLoading(false);
        return;
      }

      // Parse for JSON structure
      let suggestionObj = null;
      try {
        const startIdx = aiText.indexOf("{");
        const endIdx = aiText.lastIndexOf("}");
        suggestionObj = JSON.parse(
          aiText.substring(startIdx, endIdx + 1)
        );
        if (!suggestionObj.title) throw new Error("No title provided.");
      } catch (parseErr) {
        // fallback: use entire AI text as title
        suggestionObj = { title: aiText, details: "" };
      }

      setSuggestion(suggestionObj);
    } catch (err) {
      setError("Error contacting suggestion service.");
    }
    setLoading(false);
  }

  return (
    <div style={{ margin: "22px 0", width: "100%" }}>
      <button
        className="btn-primary"
        style={{
          padding: "8px 30px",
          minWidth: 120,
          fontWeight: 600,
          fontSize: "16px",
          marginBottom: 5,
        }}
        onClick={fetchSuggestion}
        disabled={loading}
        aria-label="Suggest task using AI"
      >
        {loading ? "Thinking..." : "Suggest Task"}
      </button>
      {error && <div style={{ color: "#c0392b", marginTop: 8 }}>{error}</div>}
      {suggestion && (
        <div
          style={{
            marginTop: 10,
            background: "#f6f7ff",
            borderRadius: 10,
            padding: 15,
            boxShadow: "0 1.5px 7px rgba(147,149,211,0.10)",
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 17, color: "#42427E" }}>
            {suggestion.title}
          </div>
          {suggestion.details && (
            <div style={{ fontSize: 15, marginTop: 4, color: "#646495" }}>
              {suggestion.details}
            </div>
          )}
          <button
            className="btn-primary"
            style={{
              marginTop: 11,
              padding: "5px 18px",
              fontSize: "15px",
              borderRadius: 7,
              background: "#1976D2",
            }}
            onClick={() => { onAccept(suggestion); setSuggestion(null); }}
          >
            Add to My Tasks
          </button>
        </div>
      )}
    </div>
  );
}

// --- StatusBar: Topmost fake mobile status bar (network, wifi, battery) ---
function StatusBar() {
  return (
    <div className="status-bar">
      <div className="notch"></div>
      <div className="status-icons">
        {/* Network Icon */}
        <svg height="14" width="14" viewBox="0 0 14 14" className="status-icon">
          <rect width="14" height="2" y="12" rx="1" fill="#FFF" />
          <rect width="10" height="2" y="9" x="2" rx="1" fill="#B8B9D3" />
          <rect width="6" height="2" y="6" x="4" rx="1" fill="#B8B9D3" />
        </svg>
        {/* Wi-Fi Icon */}
        <svg height="14" width="16" viewBox="0 0 16 14" className="status-icon">
          <path
            d="M8 12c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm3-2c0-.79-3-1.19-3-1.19S5 9.21 5 10h1.26C6.54 9.75 7.23 9.5 8 9.5s1.46.25 1.74.5H11zm2.64-2C12.46 5.56 9.54 5.56 8 6c-1.54-.44-4.46-.44-5.64 2H4.7C5.47 6.72 6.69 6 8 6s2.53.72 3.3 2h1.34zm-7.19 2H4c0-1 .16-2.27.91-3.34C5.53 6.22 6.88 5.5 8 5.5s2.47.72 3.09 1.16C11.85 7.73 12 9 12 10h-1.19z"
            fill="#FFF"
          />
        </svg>
        {/* Battery Icon */}
        <svg height="14" width="24" viewBox="0 0 24 14" className="status-icon">
          <rect x="2" y="4" width="18" height="6" rx="2" fill="#FFF" stroke="#B8B9D3" strokeWidth="1"/>
          <rect x="20" y="6" width="2.5" height="2" rx="1" fill="#B8B9D3"/>
        </svg>
      </div>
    </div>
  );
}

// --- AppBar: Header with TODO APP title and calendar icon ---
function AppBar() {
  return (
    <div className="app-bar">
      <span className="app-title">TODO APP</span>
      <div className="app-calendar">
        {/* Calendar Icon (SVG) */}
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#FFF" />
          <rect x="10" y="14" width="16" height="10" rx="3" fill="#9395D3" />
          <rect x="13" y="11" width="2" height="4" rx="1" fill="#FFF"/>
          <rect x="21" y="11" width="2" height="4" rx="1" fill="#FFF"/>
          <rect x="14" y="17" width="2" height="2" rx="1" fill="#FFF"/>
          <rect x="17" y="17" width="2" height="2" rx="1" fill="#FFF"/>
          <rect x="20" y="17" width="2" height="2" rx="1" fill="#FFF"/>
        </svg>
      </div>
    </div>
  );
}

// --- FloatingActionButton: Plus button, absolute fixed, triggers Add Task dialog ---
function FloatingActionButton({ onClick }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Add task">
      <svg width="34" height="34" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r="17" fill="#9395D3" />
        <rect x="15" y="8" width="4" height="18" rx="2" fill="#FFF" />
        <rect x="8" y="15" width="18" height="4" rx="2" fill="#FFF" />
      </svg>
    </button>
  );
}

// --- NavigationBar: Bottom nav with icons and filters ---
function NavigationBar({ filter, setFilter }) {
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <div className="nav-icon nav-playlist">
          {/* Playlist SVG */}
          <svg width="30" height="30" viewBox="0 0 30 30">
            <rect x="4" y="6" width="22" height="2.5" rx="1.2" fill="#9395D3" />
            <rect x="4" y="13" width="15" height="2.5" rx="1.2" fill="#9395D3" />
            <rect x="4" y="20" width="19" height="2.5" rx="1.2" fill="#B8B9D3" />
          </svg>
        </div>
        <div className="nav-filters">
          <span
            className={`nav-filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </span>
          <span
            className={`nav-filter ${filter === "completed" ? "inactive" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </span>
        </div>
        <div className="nav-icon nav-tick">
          {/* Tick SVG */}
          <svg width="30" height="30" viewBox="0 0 30 30">
            <polyline
              points="8,17 13,23 22,10"
              fill="none"
              stroke="#8B8686"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
}

// --- Main ToDo List Area ---
function TodoList({ tasks, onToggle, onEdit, filter }) {
  // Filter tasks by completion
  const shownTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.completed);

  return (
    <div className="todo-list">
      {shownTasks.length === 0 ? (
        <div className="empty-list">No tasks yet.</div>
      ) : (
        shownTasks.map((task) => (
          <div
            className={`todo-item${task.completed ? " completed" : ""}`}
            key={task.id}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              aria-label={`Mark ${task.title} as completed`}
            />
            <div className="todo-details" onClick={() => onEdit(task)}>
              <div className="todo-title">{task.title}</div>
              {task.details && (
                <div className="todo-desc">{task.details}</div>
              )}
            </div>
            <button
              className="edit-btn"
              title="Edit task"
              onClick={() => onEdit(task)}
            >
              ✎
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// --- Dialog Modal for Add/Edit ---
function TaskDialog({ open, onClose, onSave, task }) {
  const [title, setTitle] = useState(task ? task.title : "");
  const [details, setDetails] = useState(task ? task.details : "");

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setTitle(task ? task.title : "");
      setDetails(task ? task.details : "");
    }
  }, [open, task]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <h2>{task ? "Edit Task" : "Add Task"}</h2>
        <label>
          Title
          <input
            maxLength={40}
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </label>
        <label>
          Details
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Describe this task (optional)"
          />
        </label>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() =>
              title.trim() &&
              onSave({
                ...task,
                title: title.trim(),
                details: details.trim(),
                completed: task ? task.completed : false,
              })
            }
            disabled={!title.trim()}
          >
            {task ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main TODO PAGE Component ---
export default function TodoPage() {
  // Sample initial dummy tasks
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finish React assignment",
      details: "Implement Figma UI spec.",
      completed: false,
    },
    {
      id: 2,
      title: "Read product requirements",
      details: "",
      completed: true,
    },
  ]);
  const [filter, setFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Placeholder: CRUD actions/local state only
  const handleAdd = () => {
    setEditingTask(null);
    setShowDialog(true);
  };
  const handleSave = (task) => {
    if (task.id) {
      // Edit
      setTasks(ts => ts.map(t => (t.id === task.id ? task : t)));
    } else {
      // Add
      setTasks(ts => [
        ...ts,
        { ...task, id: Date.now(), completed: false },
      ]);
    }
    setShowDialog(false);
    setEditingTask(null);
  };
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowDialog(true);
  };
  const handleToggle = (id) => {
    setTasks(ts =>
      ts.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="todo-page-root">
      <StatusBar />
      <AppBar />
      <div className="todo-content-area">
        {/* AI Task Suggestion Button */}
        <SuggestTaskButton
          onAccept={suggestion => {
            // Add the suggestion as a new task
            setTasks(ts => [
              ...ts,
              {
                ...suggestion,
                id: Date.now() + Math.floor(Math.random() * 10000),
                completed: false,
              },
            ]);
          }}
        />
        <TodoList
          tasks={tasks}
          filter={filter}
          onToggle={handleToggle}
          onEdit={handleEdit}
        />
      </div>
      <FloatingActionButton onClick={handleAdd} />
      <NavigationBar filter={filter} setFilter={setFilter} />
      <TaskDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        task={editingTask}
      />
      {/* Placeholder: Authentication, Task CRUD, etc (to be replaced with real logic) */}
    </div>
  );
}
