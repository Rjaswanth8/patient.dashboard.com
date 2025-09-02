import { useState, useEffect } from "react";
import Popup from "./Popup";

function Appointments() {
  const [popup, setPopup] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);

  // Load appointments from localStorage on mount

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => setSubmittedData(data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  function openPopup() {
    setPopup(true);
  }

  function closePopup() {
    setPopup(false);
  }

  async function handleFormSubmit(data) {
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const savedData = await response.json();
      setSubmittedData((prev) => [...prev, savedData]);
      setPopup(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSubmittedData((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete appointment");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <div className="appoint-main">
      <div className="appoint-heading">
        <h5>Appointments</h5>
        <div className="new-appointment">
          <button onClick={openPopup}>+ New Appointment</button>
        </div>
      </div>
      <div className="search">
        <input
          type="search"
          name="search"
          placeholder="Search"
          id="docsearch"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Mode</th>
            <th>Date & Time</th>
            <th>Doctor Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {submittedData.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Appointments Yet
              </td>
            </tr>
          ) : (
            submittedData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.type}</td>
                <td>
                  {item.date} {item.time}
                </td>
                <td>{item.reason}</td>
                <td
                  className="delete-appoint"
                  onClick={() => handleDelete(item._id)}
                >
                  <i class="fi fi-br-trash"></i>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {popup && (
        <Popup closePopup={closePopup} onFormSubmit={handleFormSubmit} />
      )}
    </div>
  );
}

export default Appointments;
