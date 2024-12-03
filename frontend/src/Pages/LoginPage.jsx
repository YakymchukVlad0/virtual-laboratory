import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(null);  // Статус автентифікації
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Запобігає стандартному перезавантаженню сторінки

    setError("");  // очищуємо попередні помилки

    try {
      // Виконуємо POST запит на сервер
      const response = await axios.post(
        "http://localhost:8000/auth/login",  // ваш серверний маршрут
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // формат даних
          },
        }
      );

      // Перевірка наявності даних користувача та профілю
      const { user, activities, access_token } = response.data;

      if (!user || !activities || !access_token) {
        console.log(response.data);
        throw new Error("Invalid response data");
      }

      // Зберігаємо токен в localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("activities", JSON.stringify(activities));

      console.log(response.data, "User logged in successfully");
      const token = localStorage.getItem("token");
      console.log(localStorage);
      console.log(token);
      if (token) {
          try {
            const response = await axios.get('http://127.0.0.1:8000/auth/me', {
               headers: {
                   'Authorization': `Bearer ${token}`,
               },
            });
            setAuth({
              username: response.data.username,
              user_id: response.data.user_id, // Зберігаємо user_id
            });
            console.log(response.data); 
            window.location.href = "/module/activity";  // Перенаправлення на іншу сторінку після успішного логіну
            // Очікуйте отримати email користувача
          } catch (error) {
            console.error('Error fetching user data:', error);
        }
      }
      // Перенаправлення на іншу сторінку після успішного логіну
      window.location.href = "/module/activity";

    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");  // виведення помилки
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="loginInput" style={{display: 'flex',
    alignItems: 'baseline',
    paddingRight: '15px',
    marginLeft: '30px'}}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            style={{marginLeft: '8%'}}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="loginInput" style={{display: 'flex',
    alignItems: 'baseline',
    paddingRight: '15px',
    marginLeft: '30px'}}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div>{error}</div>}  {/* Показуємо помилку, якщо є */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
