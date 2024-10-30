import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminPage.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState(null); // Track which table is active

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/products`);
      setProducts(response.data);
      setActiveView('products');
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users`);
      setUsers(response.data);
      setActiveView('users');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="sidebar">
        <button onClick={fetchProducts}>View Products</button>
        <button onClick={fetchUsers}>View Users</button>
      </div>
      
      <div className="main-content">
        {activeView === 'products' && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Category</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>$ {product.price}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>{product.rating.rate} ({product.rating.count})</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeView === 'users' && (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Registered Date</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.created}</td>
                  <td>{user.loginHistory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
