import { useState, useEffect } from "react";

function Settings() {
  const [submittedData, setSubmittedData] = useState([]);

  const [data, setData] = useState({
    name: "",
    lastname: "",
    Email: "",
    Phone: "",
    Address1: "",
    Address2: "",
    Country: "",
    State: "",
    City: "",
    Pincode: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5000/api/profile");
        if (res.ok) {
          const profile = await res.json();
          setData(profile);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Saved Data:", result.profile);
        setIsEditing(false);
      } else {
        console.error("Failed to save profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  }

  return (
    <div className="settings container">
      <div>
        <h5 className="doc">Settings</h5>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row profile">
          <div className="profile-settings col-lg-3">
            <i className="fi fi-br-user-gear"></i>
            <span>Profile Settings</span>
          </div>
          <div className="col-lg-9 basic">
            <div className="edit">
              <h4>Basic Information</h4>
              {!isEditing && (
                <button type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )}
            </div>

            <div className="row basic-content">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>First Name</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="First Name"
                      value={data.name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Last Name</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      placeholder="Last Name"
                      value={data.lastname}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Email</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="email"
                      name="Email"
                      id="Email"
                      placeholder="Email"
                      value={data.Email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Phone Number</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="Phone"
                      id="Phone"
                      placeholder="Phone Number"
                      value={data.Phone}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
            <h4 className="address-head">Address Information</h4>
            <div className="row basic-content">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Address Line 1</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="Address1"
                      id="Address1"
                      placeholder="Address Line 1"
                      value={data.Address1}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Address Line 2</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="Address2"
                      id="Address2"
                      placeholder="Address Line 2"
                      value={data.Address2}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Country</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="Country"
                      id="Country"
                      placeholder="Country"
                      value={data.Country}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>State</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="State"
                      id="State"
                      placeholder="State"
                      value={data.State}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>City</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="City"
                      id="City"
                      placeholder="City"
                      value={data.City}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">
                    <label>Pincode</label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      name="Pincode"
                      id="Pincode"
                      placeholder="Pincode"
                      value={data.Pincode}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="save-changes">
              <button type="submit">Save Changes</button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Settings;
