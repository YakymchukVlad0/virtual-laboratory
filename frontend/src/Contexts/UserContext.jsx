import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Початково користувач не авторизований

  const login = (username) => {
    setUser({ username }); // Авторизувати користувача
  };

  const logout = () => {
    setUser(null); // Вийти з системи
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
