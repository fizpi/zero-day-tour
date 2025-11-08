import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setOpen(false); // close sidebar on mobile
  };

  return (
    <>
      {/* Hamburger button for small screens */}
      <header>
        <div  onClick={() => setOpen(!open)}>
          {open?'x': '☰'} 
        </div>
        <h3 onClick={() => handleNav("/")}>{location.pathname === "/" ? "": '<'}  Zero Day Tour</h3> 
      </header>
      

      {/* Sidebar */}
      <div className={`navbar ${open ? "open" : ""}`}>
        {/* <h3 className="navbar-title">Zero Day Tour</h3> */}

        <div className="navbar-buttons">
          <button onClick={() => handleNav("/")}>Dashboard</button>
          <button onClick={() => handleNav("/members")}>View All Members</button>
          <button onClick={() => handleNav("/add-member-payment")}>Add Member Payment</button>
          <button onClick={() => handleNav("/view-member-payment")}>View Member Payment</button>
          <button onClick={() => handleNav("/add-expense")}>Add Expanse</button>
          <button onClick={() => handleNav("/view-expenses")}>View All Expanse</button>
          <button onClick={() => handleNav("/fund-transfer")}>Fund Transfer</button>
          <button onClick={() => handleNav("/view-fund-transfer")}>View All Fund Transfer</button>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </>
  );
}
