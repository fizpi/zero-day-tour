import React, { useState } from "react";
import "./LoginPage.css";
import { callLoginApi } from "../apiWrapper";

export default function LoginPage({ setUser }) {
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    callLoginApi(login).then((res) => {
      setLoading(false);
      if (res.status === "Success") {
        setUser(login, res.data);
      } else {
        alert(res.message);
      }
    })
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Zero Day Tour</h1>
        <h3>Sikkim Dec 25</h3>
        <h4>Login</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter login token"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          {loading && <p>Loading...</p>}
          {!loading && <button type="submit">Login</button>}
        </form>
      </div>
    </div>
  );
}
