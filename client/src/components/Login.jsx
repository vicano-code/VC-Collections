import axios from "axios";
import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// let userData = {};

const Login = () => {
  // Create ref to access the form element
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const credentials = btoa(`${email}:${password}`); // Base64 encode the credentials

    try {
      const response = await axios.post(
        "http://localhost:5000/users/login",
        {}, // Passing an empty body since the credentials are in the headers
        { 
          headers: { 
          'Authorization': `Basic ${credentials}`,
          "Content-Type": "application/json" 
          } 
        }
      );
      if (response.status === 200) {
        const token = response.data.token; // Extract the token and user from the response
        const user = response.data.user; // Extract the token and user from the response
        localStorage.setItem('token', token); // Store the token to localStorage
       
        // console.log(token);
        // console.log(user);

        setErrorMessage("Login Successful...redirecting");
        setTimeout(() => {
          setErrorMessage("");
          formRef.current.reset(); // Clear the login form
          // Redirect to User account page and pass the user data to the UserAccount component
          navigate("/userAccount", { state: { user } }); 
        }, 3000);
        console.log('Login successful');
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setErrorMessage("Error during login: " + error.message);
    }
  };
  return (
    <>
      <section className="vh-100">
        <div className="container py-2 mt-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ "borderRadius": "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="login form"
                      className="img-fluid"
                      style={{ "borderRadius": "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form ref={formRef} onSubmit={handleLogin}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <span className="h2 fw-normal mb-0">LOGIN</span>
                        </div>

                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ "letterSpacing": "1px" }}
                        >
                          Sign into your account
                        </h5>

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
                            Email address
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

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Login
                          </button>
                        </div>
                        {/* Render the error message if it exists */}
                        {errorMessage && (
                          <p style={{ color: "red" }}>{errorMessage}</p>
                        )}

                        <a className="small text-muted" href="#!">
                          Forgot password?
                        </a>
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Don't have an account?{" "}
                          <NavLink
                            className="nav-link"
                            to="/Register"
                            style={{ color: "#393f81" }}
                          >
                            <u>Register here</u>
                          </NavLink>
                        </p>
                        <br />
                        <a href="#!" className="small text-muted">
                          Privacy policy
                        </a>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
