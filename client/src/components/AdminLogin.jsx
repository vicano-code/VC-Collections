import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate to the admin dashboard after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();

    //try {
      //const response = await axios.post('/admin/login', { username, password });
      // Store the token in localStorage
      //localStorage.setItem('token', response.data.token);
      // Redirect to the admin dashboard
      if (username === 'admin' && password === 'admin') {
        navigate(`${backendUrl}/admin/dashboard`);
      }
    //} catch (error) {
      //setError('Invalid login credentials');
    //}
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {<p className="error">{}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
