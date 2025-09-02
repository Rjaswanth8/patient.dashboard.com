// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      fullName: form.fullName?.value,
      email: form.email.value,
      password: form.password.value,
    };

    const endpoint = isLogin ? "/api/login" : "/api/signup";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");

      if (result.user) {
        localStorage.setItem("authEmail", result.user.email);
      } else if (!isLogin) {
        localStorage.setItem(
          "user",
          JSON.stringify({ fullName: data.fullName, email: data.email })
        );
      }

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <div className="row align-center">
          <div className="col-12 col-lg-6 login-text">
            <h2>Welcome, to HR Admin Dashboard</h2>
            <p>
              {isLogin
                ? "Use your email and password to login"
                : "Create a new account"}
            </p>

            <form className="login-details" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    required
                  />
                  <i className="fa-solid fa-user"></i>
                </>
              )}

              <input type="email" name="email" placeholder="Email" required />
              <i className="fa-solid fa-envelope"></i>

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <i className="fa-solid fa-key"></i>

              {isLogin && (
                <div className="forgot">
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              )}

              <button type="submit">{isLogin ? "Login" : "Signup"}</button>

              <p>
                {isLogin ? (
                  <>
                    No account?{" "}
                    <a href="#" onClick={() => setIsLogin(false)}>
                      Sign up
                    </a>
                  </>
                ) : (
                  <>
                    Have an account?{" "}
                    <a href="#" onClick={() => setIsLogin(true)}>
                      Log in
                    </a>
                  </>
                )}
              </p>
            </form>
          </div>

          <div className="col-12 col-lg-6 login-content">
            <h2>{isLogin ? "Login Form" : "Signup Form"}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
