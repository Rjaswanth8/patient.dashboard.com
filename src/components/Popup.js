import { useState } from "react";

function Popup({ closePopup = () => {}, onFormSubmit = () => {} }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    type: "Select",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onFormSubmit === "function") {
      onFormSubmit(formData);
    } else {
      console.error("❌ onFormSubmit is not a function!", onFormSubmit);
    }
  };

  return (
    <div className="side-popup">
      <div className="side-popup-header">
        <h4>New Appointment</h4>
        <button type="button" className="close-btn" onClick={closePopup}>
          &#x2716;
        </button>
      </div>

      <form className="side-popup-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleChange}
        />

        <label>Age</label>
        <input
          type="text"
          name="age"
          value={formData.age}
          placeholder="Age"
          onChange={handleChange}
        />

        <label>Appointment Type</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Select">Select</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <div className="date-time">
          <div>
            <label>Date of Appointment</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Appointment Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          rows="4"
          className="form-control rounded"
          onChange={handleChange}
        />

        <div className="create-cancel">
          <button className="cancel" onClick={closePopup}>
            Cancel
          </button>
          <button type="submit">Create Appointment</button>
        </div>
      </form>
    </div>
  );
}

export default Popup;
