import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Send login details to backend
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(
          data.message || "Login failed."
        );

        return;
      }

      // Save JWT
      localStorage.setItem(
        "token",
        data.token
      );

      // Save safe user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Tell App that login was successful
      onLogin(data.user);

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Make sure your backend is running."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-left">

          <div className="auth-brand">
            Study<span>Planner</span>
          </div>

          <div className="auth-message">

            <p className="auth-small-title">
              YOUR PERSONAL STUDY SPACE
            </p>

            <h1>
              Plan your studies.
              <br />
              Achieve your goals.
            </h1>

            <p>
              Organize your courses, assignments,
              schedule and academic progress in
              one simple place.
            </p>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="auth-right">

          <div className="auth-form-container">

            <h2>
              Welcome back
            </h2>

            <p className="auth-subtitle">
              Login to continue to your Study Planner.
            </p>


            {/* ERROR */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            {/* LOGIN FORM */}
            <form onSubmit={handleLogin}>

              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />


              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />


              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>


            {/* REGISTER LINK */}
            <p className="switch-auth">

              Don't have an account?

              <button
                type="button"
                onClick={goToRegister}
                className="link-button"
              >
                Register
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;