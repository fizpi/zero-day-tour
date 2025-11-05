import React, { useState, useEffect } from "react";
import LoginPage from "./login/LoginPage";
import Dashboard from "./Dashboard";
import { BrowserRouter} from "react-router-dom";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const setUser = (tkn, name)=>{
    localStorage.setItem("token", tkn);
    localStorage.setItem("name", name);
    setName(name);
    setToken(tkn);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
  };

  return token ? (
    <BrowserRouter>
      <Dashboard onLogout={handleLogout} />
    </BrowserRouter>
  ) : (
    <LoginPage setUser={setUser} />
  );
}
