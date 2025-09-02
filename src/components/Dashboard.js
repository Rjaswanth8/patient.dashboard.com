import { useState, useEffect } from "react";
import Popup from "./Popup";

import Doctors from "./Doctordata";
import { Timeline } from "primereact/timeline";

function Dashboard({ count }) {
  const [userDetails, setUserDetails] = useState({ fullName: "", email: "" });
  const [popup, setPopup] = useState(false);

  const length = Doctors.length;

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);

  //timeline

  const events = [
    {
      status: "Ordered",
      date: "15/10/2020 10:30",
      icon: "pi pi-shopping-cart",
      color: "#9C27B0",
      image: "game-controller.jpg",
    },
    {
      status: "Processing",
      date: "15/10/2020 14:00",
      icon: "pi pi-cog",
      color: "#673AB7",
    },
    {
      status: "Shipped",
      date: "15/10/2020 16:15",
      icon: "pi pi-shopping-cart",
      color: "#FF9800",
    },
    {
      status: "Delivered",
      date: "16/10/2020 10:00",
      icon: "pi pi-check",
      color: "#607D8B",
    },
  ];

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch("http://localhost:5000/api/appointments");
        const appointments = await response.json();

        const total = appointments.length;
        const online = appointments.filter((a) => a.type === "Online").length;
        const offline = appointments.filter((a) => a.type === "Offline").length;

        setAppointmentCount(total);
        setOnlineCount(online);
        setOfflineCount(offline);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    }

    fetchAppointments();
  }, []);

  function openPopup(e) {
    setPopup(true);
  }

  function closePopup(e) {
    setPopup(false);
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

  return (
    <div className="dashboard">
      {/* <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="welcome-msg">
            <h2>Hello {userDetails.fullName}!</h2>
            <p>Welcome back to Patient Dashboard</p>
          </div>
          <div className="new-appointment">
            <button onClick={openPopup}>+ New Appointment</button>
          </div>
        </div>
      </div> */}
      <div className="heading-main">
        <h5>Patient Dashboard</h5>
        {/* <div className="new-appointment">
          <button onClick={openPopup}>+ New Appointment</button>
        </div> */}
      </div>

      <div className="dash-information">
        <div className="row">
          <div className="info-box col-lg-3 shadow-sm">
            <i class="fi fi-rr-calendar-clock"></i>
            <div className="info">
              <h6>Total Appointments</h6>
              <h5>{appointmentCount}</h5>
            </div>
          </div>
          <div className="info-box col-lg-3 shadow-sm">
            <i class="fi fi-sr-user-writer"></i>
            <div className="info">
              <h6>Online Consultations</h6>
              <h5>{onlineCount}</h5>
            </div>
          </div>
          <div className="info-box col-lg-3 shadow-sm">
            <i class="fi fi-sr-user-writer"></i>
            <div className="info">
              <h6>Offline Consultations</h6>
              <h5>{offlineCount}</h5>
            </div>
          </div>
          <div className="info-box col-lg-3 shadow-sm">
            <i class="fi fi-rr-user-md"></i>
            <div className="info">
              <h6>No. of Doctors</h6>
              <h5>{Doctors.length}</h5>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-12 mt-4 bg-white pb-3 dash-container">
            <div className="dash-box2-head">
              <h6>My Doctors</h6>
            </div>
            <div className="dash-box2">
              {Doctors.map((item) => (
                <div className="my-doc">
                  <div>
                    <img src="/doctor-01.jpg" alt="doc" />
                  </div>
                  <div className="ms-2">
                    <p>{item.name}</p>
                    <span>{item.department}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4 col-12 mt-4 bg-white pb-3 dash-container">
            <div className="dash-box2-head">
              <h6>Prescriptions</h6>
            </div>
            <div className="dash-box2"></div>
          </div>

          <div className="col-lg-4 col-12 mt-4 bg-white pb-3 dash-container">
            <div className="dash-box2-head">
              <h6>Recent Activity</h6>
            </div>
            <div className="dash-box2">
              <div className="card">
                <Timeline value={events} content={(item) => item.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {popup && <Popup closePopup={closePopup} />}
    </div>
  );
}

export default Dashboard;
