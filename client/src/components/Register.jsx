import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Register = () => {
  // Create ref to access the form element
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const repeatPassword = document.querySelector("#repeatPassword").value;

    if (password !== repeatPassword) {
      setErrorMessage("Passwords do not match."); // Set error if passwords don't match
      return;
    } else {
      setErrorMessage("");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/users/addUser",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("User added:", response.data);
      setErrorMessage(""); // clear any previous error messages
      formRef.current.reset(); // Clear the entire form
      

    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <section className="vh-100 bg-image mt-5">
        <div className="mask d-flex align-items-center gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ "borderRadius": "15px" }}>
                  <div className="card-body p-5 mb-3">
                    <span className="h2 fw-normal mb-0">REGISTER</span>

                    <form
                      ref={formRef}
                      id="myForm"
                      onSubmit={handleSubmit}
                    >
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control form-control-lg"
                          autoComplete="name"
                          required
                        />
                        <label className="form-label" htmlFor="name">
                          Your Name
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control form-control-lg"
                          autoComplete="email"
                          required
                        />
                        <label className="form-label" htmlFor="email">
                          Your Email
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control form-control-lg"
                          required
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="repeatPassword"
                          name="repeatPassword"
                          className="form-control form-control-lg"
                          required
                        />
                        <label className="form-label" htmlFor="repeatPassword">
                          Repeat your password
                        </label>
                      </div>

                      <div className="form-check d-flex justify-content-center mb-5">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          name="termsOfService"
                          id="termsOfService"
                          required
                        />
                        <label className="form-check-label" htmlFor="termsOfService">
                          I agree all statements in{" "}
                          <a href="#!" className="text-body">
                            <u>Terms of service</u>
                          </a>
                        </label>
                      </div>
                      {/* Render the error message if it exists */}
                      {errorMessage && (
                        <p style={{ color: "red" }}>{errorMessage}</p>
                      )}

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        >
                          Register
                        </button>
                      </div>

                      <p className="text-center text-muted mt-5 mb-0">
                        Have already an account?{" "}
                        <NavLink
                          className="nav-link fw-bold text-body"
                          to="/Login"
                        >
                          <u>Login here</u>
                        </NavLink>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
