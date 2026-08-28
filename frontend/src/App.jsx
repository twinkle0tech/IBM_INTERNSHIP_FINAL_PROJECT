import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ItemList from "./components/ItemList";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";
import Assignments from "./pages/Assignments";
import TodoList from "./pages/TodoList";
import Exams from "./pages/Exams";
import Settings from "./pages/Settings";

import "./App.css";


const API_URL = "http://localhost:5000";


// Get saved user safely
const getStoredUser = () => {
  try {

    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;

  } catch (error) {

    console.error(
      "Could not read saved user:",
      error
    );

    localStorage.removeItem("user");

    return null;
  }
};


// Get current browser path
const getPath = () => {
  return window.location.pathname || "/";
};


// ========================================
// DASHBOARD
// ========================================

function Dashboard({
  user,
  onLogout,
  onUserUpdate
}) {

  const [path, setPath] = useState(
    getPath()
  );


  // Listen for browser Back/Forward
  useEffect(() => {

    const handlePopState = () => {
      setPath(getPath());
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {

      window.removeEventListener(
        "popstate",
        handlePopState
      );

    };

  }, []);


  // Navigate without reloading page
  const navigate = (nextPath) => {

    window.history.pushState(
      {},
      "",
      nextPath
    );

    setPath(nextPath);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  const renderPage = () => {

    switch (path) {

      case "/courses":
        return <Courses />;

      case "/schedule":
        return <Schedule />;

      case "/assignments":
        return <Assignments />;

      case "/todo":
      case "/todos":
        return <TodoList />;

      case "/exams":
        return <Exams />;

      case "/settings":
        return <Settings user={user} onUserUpdate={onUserUpdate} />;

      case "/home":
      case "/":
      default:

        return (
          <>
            <Hero
              user={user}
              onNavigate={navigate}
            />

            <ItemList />
          </>
        );
    }
  };


  return (
    <div className="app">

      <Navbar
        user={user}
        currentPath={path}
        onNavigate={navigate}
        onLogout={onLogout}
      />

      <main className="main-content">
        {renderPage()}
      </main>

    </div>
  );
}


// ========================================
// MAIN APP
// ========================================

function App() {

  const [page, setPage] = useState(() => {

    const token =
      localStorage.getItem("token");

    return token
      ? "dashboard"
      : "login";
  });


  const [user, setUser] = useState(
    getStoredUser
  );


  const [loadingUser, setLoadingUser] =
    useState(() =>
      Boolean(
        localStorage.getItem("token")
      )
    );


  // ======================================
  // CHECK EXISTING LOGIN SESSION
  // ======================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");


    // No token means user is logged out
    if (!token) {

      setLoadingUser(false);

      return;
    }


    const loadProfile = async () => {

      try {

        const response = await fetch(
          `${API_URL}/api/auth/profile`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


        // Invalid or expired token
        if (!response.ok) {
          throw new Error(
            "Session expired"
          );
        }


        const data =
          await response.json();


        // Store current user
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setPage("dashboard");


      } catch (error) {

        console.error(
          "Profile loading error:",
          error
        );


        // Remove invalid session
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );


        setUser(null);
        setPage("login");


      } finally {

        setLoadingUser(false);
      }
    };


    loadProfile();

  }, []);


  // ======================================
  // LOGIN / REGISTER SUCCESS
  // ======================================

  const handleAuthSuccess = (
    loggedInUser
  ) => {

    setUser(loggedInUser);

    setPage("dashboard");


    window.history.pushState(
      {},
      "",
      "/"
    );
  };


  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    setUser(null);

    setPage("login");


    window.history.pushState(
      {},
      "",
      "/"
    );
  };


  // ======================================
  // LOADING SESSION
  // ======================================

  if (loadingUser) {

    return (
      <div className="loading-screen">

        Loading your Study Planner...

      </div>
    );
  }


  // ======================================
  // LOGIN
  // ======================================

  if (page === "login") {

    return (
      <Login
        onLogin={handleAuthSuccess}
        goToRegister={() =>
          setPage("register")
        }
      />
    );
  }


  // ======================================
  // REGISTER
  // ======================================

  if (page === "register") {

    return (
      <Register
        onRegister={handleAuthSuccess}
        goToLogin={() =>
          setPage("login")
        }
      />
    );
  }


  // No user
  if (!user) {
    return null;
  }


  // ======================================
  // DASHBOARD
  // ======================================

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onUserUpdate={setUser}
    />
  );
}


export default App;
