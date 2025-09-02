// App.js
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Auth from "./Login";
import Dashboard from "./components/Dashboard";
import Doctors from "./components/Doctors";
import Appointments from "./components/Appointments";
import Prescriptions from "./components/Prescriptions";
import Settings from "./components/Settings";

function DashboardLayout() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [userDetails, setUserDetails] = useState({ fullName: "", email: "" });
  const [profilepop, setProfilepop] = useState(false);

  function Profilepopup(e) {
    e.preventDefault();
    setProfilepop((prev) => !prev);
  }

  useEffect(() => {
    const email = localStorage.getItem("authEmail");

    if (email) {
      fetch(`http://localhost:5000/api/user?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setUserDetails(data);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    }
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const isActive = (path) =>
    activePath === path
      ? "d-flex align-items-flex-start position-relative nav-links active"
      : "d-flex align-items-flex-start position-relative nav-links";

  return (
    <div>
      <header className="header container">
        <div className="row">
          <div className="search-bar col-lg-4">
            {/* <i class="fi fi-br-search"></i>
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Search"
            />
            <button type="submit">Search</button> */}
          </div>
          <div className="col-lg-8">
            <div className="header-icons">
              {/* <div className="col-lg-4"></div> */}
              <div className="">
                <Link to="/settings">
                  <i className="fi fi-rc-settings"></i>
                </Link>
              </div>

              <div className="avatar-circle" onClick={Profilepopup}>
                {userDetails.fullName
                  ? userDetails.fullName.charAt(0).toUpperCase()
                  : ""}
              </div>
            </div>
            {profilepop && (
              <div className="profile-pop">
                <div className="profile-details">
                  <p className="avatar-circle">
                    {userDetails.fullName
                      ? userDetails.fullName.charAt(0).toUpperCase()
                      : ""}
                  </p>
                  <div className="name-email">
                    <h5>{userDetails.fullName}</h5>
                    <p>{userDetails.email}</p>
                  </div>
                </div>
                <div className="profile-popup-links">
                  <i class="fi fi-br-user-gear"></i>
                  <span>
                    <Link to="/settings">Profile Settings</Link>
                  </span>
                  <div
                    className="profile-logout"
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}
                  >
                    <i class="fi fi-br-user-logout"></i>
                    <Link to="/">Logout</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div>
          <h5>{userDetails.fullName}</h5>
          <p>{userDetails.email}</p>
        </div> */}
      </header>

      <nav className="side-navbar p-5 gy-4">
        <div className="logo-div">
          <img src="/logo.png" alt="logo" className="logo" />
        </div>

        <div className={isActive("/dashboard")}>
          <i className="fi fi-sr-apps"></i>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className={isActive("/appointments")}>
          <i className="fi fi-rr-calendar-clock"></i>
          <Link to="/appointments">Appointments</Link>
        </div>
        <div className={isActive("/doctors")}>
          <i class="fi fi-rr-user-md"></i>
          <Link to="/doctors">Doctors</Link>
        </div>
        <div className={isActive("/prescriptions")}>
          <i className="fi fi-br-prescription"></i>
          <Link to="/prescriptions">Prescriptions</Link>
        </div>
        <div className={isActive("/settings")}>
          <i className="fi fi-rc-settings"></i>
          <Link to="/settings">Settings</Link>
        </div>
        <div
          className="logout"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          <i class="fi fi-br-user-logout"></i>
          <Link to="/">Logout</Link>
        </div>
      </nav>

      <div className="flex-grow-1">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
}

export default App;
