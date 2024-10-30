import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Handle form submission here (e.g., send data to API)
    try {
      const response = await axios.post(
        `${backendUrl}/users/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("User added:", response.data);
      setSuccessMessage("Sign-up successful!...redirecting");
      setTimeout(() => {
        setErrorMessage(""); // clear
        // Reset form fields
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login"); // Redirect to login page
      }, 3000);
    } catch (error) {
      // console.error("Error:", error.message);
      setErrorMessage("Error: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow mb-5" style={{ borderRadius: "15px" }}>
            <h2 className="text-center mb-4">Sign Up</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-3" htmlFor="name">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-3" htmlFor="email">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-3" htmlFor="password">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-3" htmlFor="confirmPassword">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              {successMessage && (
                <p className="text-success">{successMessage}</p>
              )}

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
