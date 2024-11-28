import { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import "../Styles/RegisterPage.css";

const RegisterPage = () => {
    const { register } = useAuth();
    const [data, setData] = useState({ email: '', first_name: '', last_name: '', password: '' });
    const [error, setError] = useState(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Об'єднуємо first_name та last_name в поле user_name перед відправкою
        const userData = { 
            ...data, 
            username: `${data.first_name} ${data.last_name}` 
          };
        await register(userData);
        setError(null);
        alert('Registration successful!');
      } catch (err) {
        setError(err.response?.data?.detail || 'Registration failed');
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <h1 className="authTitle">Register</h1>
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="First Name"
            value={data.first_name}
            onChange={(e) => setData({ ...data, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={data.last_name}
            onChange={(e) => setData({ ...data, last_name: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button type="submit">Register</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  };
  
  export default RegisterPage;