import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Створення контексту для автентифікації
const AuthContext = createContext();

// Хук для доступу до контексту
export const useAuth = () => useContext(AuthContext);

// Провайдер для автентифікації
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);  // Статус автентифікації
  const [loading, setLoading] = useState(true);  // Статус завантаження (перевірка автентифікації)
  const navigate = useNavigate();  // Для навігації

  // Перевірка автентифікації користувача
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuth(null);  // Якщо токен відсутній, скидаємо стан
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuth({ token, username: response.data.username });  // Зберігаємо дані користувача
    } catch (err) {
      console.error('Authorization failed:', err);
      logout();  // Якщо сталася помилка — виконуємо logout
    } finally {
      setLoading(false);  // Завершуємо завантаження
    }
  };

  // Функція для входу
  const login = async (data) => {
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
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("activities", JSON.stringify(activities));

      setAuth({ token: access_token, user })
      setAuth(true);
      console.log(response.data, "User logged in successfully");
      console.log(user.username, "User logged in successfully");
      // Перенаправлення на іншу сторінку після успішного логіну
      navigate("/module");

    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");  // виведення помилки
    }
  };
  // Функція для реєстрації
  const register = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/register', data);
      alert(response.data.message);  // Повідомлення про успіх
      navigate('/login');  // Перенаправляємо на сторінку входу після реєстрації
    } catch (err) {
      console.error('Registration failed:', err);
      // Можна додати повідомлення про помилку тут
    }
  };

  // Функція для виходу з системи
  const logout = () => {
    localStorage.removeItem('token');  // Видаляємо токен з localStorage
    setAuth(null);  // Скидаємо стан автентифікації
    navigate('/login');  // Перенаправляємо на сторінку входу після виходу
  };

  // Викликаємо перевірку автентифікації при першому рендері
  useEffect(() => {
    checkAuth();
  }, []);

  // Повертаємо провайдер контексту з усіма функціями і станами
  return (
    <AuthContext.Provider value={{ auth, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
