import "./App.css";
import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    registerUser,
    loginUser,
    generateTaskDescription
} from "./api";

const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
    const [token, setToken] = useState(
        localStorage.getItem("taskManagerToken") || ""
    );
    const [authMode, setAuthMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiFallback, setAiFallback] = useState(false);

    const isAuthenticated = Boolean(token);

    useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getTasks();
                setTasks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [token]);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required");
            return;
        }

        try {
            setError("");

            if (authMode === "register") {
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }

                await registerUser(email, password);
                setAuthMode("login");
                setError("Registration successful. Please log in.");
                setPassword("");
                setConfirmPassword("");
                return;
            }

            const data = await loginUser(email, password);
            localStorage.setItem("taskManagerToken", data.token);
            setToken(data.token);
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("taskManagerToken");
        setToken("");
        setTasks([]);
        setError("");
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            setError("");
            const newTask = await createTask({ title, description });
            setTasks((prev) => [...prev, newTask]);
            setTitle("");
            setDescription("");
            setAiFallback(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGenerateAI = async () => {
        if (!title.trim()) {
            setError("Enter a task title first to generate an AI description.");
            return;
        }

        try {
            setIsGeneratingAI(true);
            setError("");
            setAiFallback(false);
            const data = await generateTaskDescription(title);
            if (data.description) {
                setDescription(data.description);
            }
            if (data.fallback) {
                setAiFallback(true);
            }
        } catch (err) {
            setError(err.message || "Failed to generate AI suggestion");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleUpdate = async (task) => {
        try {
            setError("");

            const updatedTask = await updateTask(task._id, {
                completed: !task.completed
            });

            setTasks((prev) =>
                prev.map((item) =>
                    item._id === updatedTask._id ? updatedTask : item
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            setError("");
            await deleteTask(id);
            setTasks((prev) =>
                prev.filter((task) => task._id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // ========== AUTH SCREEN ==========
    if (!isAuthenticated) {
        return (
            <div className="auth-screen">
                <div className="auth-card">
                    <div className="auth-logo">&#9744;</div>
                    <h1>
                        {authMode === "login"
                            ? "Welcome back"
                            : "Create account"}
                    </h1>

                    <p className="auth-subtitle">
                        {authMode === "login"
                            ? "Sign in to manage your tasks."
                            : "Register to start managing tasks."}
                    </p>

                    {error && <p className="error">{error}</p>}

                    <form
                        className="auth-form"
                        onSubmit={handleAuthSubmit}
                    >
                        <input
                            className="auth-field"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <input
                            className="auth-field"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        {authMode === "register" && (
                            <input
                                className="auth-field"
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        )}

                        <button
                            type="submit"
                            className="btn-primary auth-btn"
                        >
                            {authMode === "login"
                                ? "Sign In"
                                : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        <span>
                            {authMode === "login"
                                ? "Need an account?"
                                : "Already have an account?"}
                        </span>

                        <button
                            type="button"
                            className="link-btn"
                            onClick={() => {
                                setAuthMode(
                                    authMode === "login"
                                        ? "register"
                                        : "login"
                                );
                                setError("");
                                setPassword("");
                                setConfirmPassword("");
                            }}
                        >
                            {authMode === "login"
                                ? "Register"
                                : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========== MAIN APP ==========
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.length - completedCount;

    return (
        <BrowserRouter>
            <div className="app">

                {/* Navigation */}
                <nav className="nav">
                    <Link to="/">Tasks</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/contact">Contact</Link>
                </nav>

                {/* Lazy-loaded routes */}
                <Suspense
                    fallback={
                        <div className="loading">
                            Loading page...
                        </div>
                    }
                >
                    <Routes>
                        <Route
                            path="/projects"
                            element={<Projects />}
                        />

                        <Route
                            path="/contact"
                            element={<Contact />}
                        />

                        <Route
                            path="/"
                            element={
                                <div className="container">

                                    <header className="header">
                                        <h1>Task Manager</h1>

                                        <p>
                                            Stay organized and keep track
                                            of your work.
                                        </p>

                                        <button
                                            type="button"
                                            className="logout-btn"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </header>

                                    {/* Stats Bar */}
                                    <div className="stats-bar">
                                        <div className="stat-item">
                                            <span className="stat-number">{tasks.length}</span>
                                            <span className="stat-label">Total</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number stat-pending">{pendingCount}</span>
                                            <span className="stat-label">Pending</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number stat-done">{completedCount}</span>
                                            <span className="stat-label">Done</span>
                                        </div>
                                    </div>

                                    <section className="form-card">
                                        <h2>Add a new task</h2>

                                        <form
                                            className="task-form"
                                            onSubmit={handleCreate}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Task title"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                            />

                                            <div className="description-row">
                                                <input
                                                    type="text"
                                                    placeholder="Description (or use AI below)"
                                                    value={description}
                                                    onChange={(e) =>
                                                        setDescription(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="ai-btn"
                                                    onClick={handleGenerateAI}
                                                    disabled={isGeneratingAI || !title.trim()}
                                                    title="Generate description with Gemini AI"
                                                >
                                                    {isGeneratingAI ? "Generating..." : "AI Suggest"}
                                                </button>
                                            </div>

                                            {aiFallback && (
                                                <p className="ai-note">
                                                    Note: Used fallback template. Check API key configuration.
                                                </p>
                                            )}

                                            <p className="ai-disclaimer">
                                                AI-generated suggestions should be reviewed before use.
                                            </p>

                                            <button
                                                className="btn-primary"
                                                type="submit"
                                            >
                                                Add Task
                                            </button>
                                        </form>
                                    </section>

                                    {loading && (
                                        <p className="loading">
                                            Loading tasks...
                                        </p>
                                    )}

                                    {error && (
                                        <p className="error">
                                            {error}
                                        </p>
                                    )}

                                    <div className="tasks-header">
                                        <h2>Tasks</h2>

                                        <span className="task-count">
                                            {tasks.length} tasks
                                        </span>
                                    </div>

                                    {tasks.length === 0 && !loading && (
                                        <div className="empty">
                                            No tasks found. Create your first task above!
                                        </div>
                                    )}

                                    <div className="task-list">
                                        {tasks.map((task) => (
                                            <div
                                                key={task._id}
                                                className={`task-card ${
                                                    task.completed
                                                        ? "completed"
                                                        : ""
                                                }`}
                                            >
                                                <div className="task-top">
                                                    <div>
                                                        <h3 className="task-title">
                                                            {task.title}
                                                        </h3>

                                                        <p className="task-description">
                                                            {task.description ||
                                                                "No description provided."}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`status ${
                                                            task.completed
                                                                ? "completed"
                                                                : "pending"
                                                        }`}
                                                    >
                                                        {task.completed
                                                            ? "Completed"
                                                            : "Pending"}
                                                    </span>
                                                </div>

                                                <div className="task-actions">
                                                    <button
                                                        type="button"
                                                        className="update-btn"
                                                        onClick={() =>
                                                            handleUpdate(task)
                                                        }
                                                    >
                                                        {task.completed
                                                            ? "Mark Pending"
                                                            : "Mark Completed"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                task._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </Suspense>
            </div>
        </BrowserRouter>
    );
}

export default App;